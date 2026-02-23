import { EventPriceDomain } from '@/lib/domain/eventPriceDomain/EventPriceDomain';
import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { CreateEvent } from '@/lib/schemas/event/createEventFormSchema';
import { AgeRangeValue } from '@/lib/types/AgeRange';
import { EventCategory } from '@/lib/types/EventCategory';
import { PriceTypeValue } from '@/lib/types/PriceType';
import { parseZonedToUTC } from '@/lib/utils/dateTime/dateTimeHelpers';

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
    if (input.tags.length > 5) throw EventErrors.InvalidTagNumber();
    return new EventDomain({
      status: input.status,
      title: input.eventName,
      category: input.category,
      publishedAt: input.status === 'PUBLISHED' ? new Date() : null,
      description: input.eventDescription,
      startsAtUTC: start.utcDate,
      endsAtUTC: end ? end.utcDate : null,
      timezone: start.timeZone,
      organizationId,
      imageId: input.imageId,
      locationId: input.locationId,
      minPriceCents: pricing?.min?.cents,
      maxPriceCents: pricing?.max?.cents,
      pricingType: pricing.type,
      ageRestriction: input.ageRestriction,
      tags: input.tags,
    });
  }
}
