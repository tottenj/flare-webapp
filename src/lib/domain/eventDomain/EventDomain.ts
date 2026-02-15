import { EventPriceDomain } from '@/lib/domain/eventPriceDomain/EventPriceDomain';
import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { CreateEvent } from '@/lib/schemas/event/createEventFormSchema';
import { AgeRangeValue } from '@/lib/types/AgeRange';
import { EventCategory } from '@/lib/types/EventCategory';

import { PriceTypeValue } from '@/lib/types/PriceType';
import { parseZonedToUTC } from '@/lib/utils/dateTime/dateTimeHelpers';
import { FlareEvent } from '@prisma/client';

export type EventDomainProps = {
  organizationId: string;
  category: EventCategory;
  title: string;
  description: string;
  ageRestriction: AgeRangeValue;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: Date | null;
  imageId?: string | null;
  startsAtUTC: Date;
  endsAtUTC?: Date | null;
  timezone: string;
  locationId?: string | null;
  pricingType: PriceTypeValue;
  minPriceCents?: number | null;
  maxPriceCents?: number | null;
  tags: string[];
};


export type CreateEventResolved = Omit<CreateEvent, 'image' | 'location'> & {
  imageId: string;
  locationId?: string | null;
};

export class EventDomain {
  private constructor(public readonly props: EventDomainProps) {}

  static onCreate(input: CreateEventResolved, organizationId: string) {
    const pricing = EventPriceDomain.fromInput(input.priceType, input.minPrice, input.maxPrice);
    const start = parseZonedToUTC(input.startDateTime);
    const end = input.endDateTime ? parseZonedToUTC(input.endDateTime) : null;
    if (end && end.utcDate <= start.utcDate) throw EventErrors.InvalidTimeRange();
    const tags = input.tags.map((t) => t.trim().toLowerCase());
    if (tags.length > 5) throw EventErrors.InvalidTagNumber();
    return new EventDomain({
      status: input.status,
      title: input.eventName,
      category: input.category,
      publishedAt: input.status === 'PUBLISHED' ? new Date() : null,
      description: input.eventDescription,
      startsAtUTC: start.utcDate,
      endsAtUTC: end?.utcDate,
      timezone: start.timeZone,
      organizationId,
      imageId: input.imageId,
      locationId: input.locationId,
      minPriceCents: pricing?.min?.cents,
      maxPriceCents: pricing?.max?.cents,
      pricingType: pricing.type,
      ageRestriction: input.ageRestriction,
      tags,
    });
  }

  static fromRow(row: FlareEvent) {
    return new EventDomain({
      organizationId: row.organizationId,
      status: row.status,
      title: row.title,
      category: row.category,
      description: row.description,
      startsAtUTC: row.startsAtUTC,
      endsAtUTC: row.endsAtUTC,
      timezone: row.timezone,
      pricingType: row.pricingType,
      minPriceCents: row.minPriceCents,
      maxPriceCents: row.maxPriceCents,
      ageRestriction: row.ageRestriction,
      imageId: row.imageId,
      locationId: row.locationId,
      tags: row.tags,
    });
  }
}
