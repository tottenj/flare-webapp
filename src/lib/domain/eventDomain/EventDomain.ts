import { EventPriceDomain } from '@/lib/domain/eventPriceDomain/EventPriceDomain';
import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { CreateEvent } from '@/lib/schemas/event/createEventFormSchema';
import { AgeRangeValue } from '@/lib/types/AgeRange';
import { PriceTypeValue } from '@/lib/types/PriceType';
import { parseZonedToUTC } from '@/lib/utils/dateTime/dateTimeHelpers';

export type EventDomainProps = {
  organizationId: string;
  title: string;
  description: string;
  ageRestriction: AgeRangeValue;
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
  locationId: string | null;
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
      title: input.eventName,
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
}
