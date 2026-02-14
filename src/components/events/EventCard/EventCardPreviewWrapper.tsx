'use client';

import { PRICE_TYPE_LABEL, PriceTypeValue } from '@/lib/types/PriceType';
import EventCardPresentational from './EventCardPresentational';
import { AGE_RANGE_LABEL, AgeRangeValue } from '@/lib/types/AgeRange';
import { CreateEventPreviewForm } from '@/lib/schemas/event/createEventPreviewFormSchema';
import { parseZonedDateTime } from '@internationalized/date';
import formatEventPrice from '@/lib/utils/ui/formatEventPrice/formatEventPrice';
import { parseZonedToISO } from '@/lib/utils/dateTime/dateTimeHelpers';

interface EventCardPreviewWrapperProps {
  preview: CreateEventPreviewForm;
  imgUrl: string | null;
  orgName?: string;
}

export default function EventCardPreviewWrapper({
  preview,
  imgUrl,
  orgName,
}: EventCardPreviewWrapperProps) {
   const start = parseZonedToISO(preview.startDateTime)
   const price = formatEventPrice({priceType: preview.priceType as PriceTypeValue, minPrice: preview.minPrice, maxPrice: preview.maxPrice})

  return (
    <div className="p-4">
      <EventCardPresentational
        title={preview.eventName}
        organizer={orgName ?? 'Your Organization'}
        image={imgUrl ?? '/placeholder-event.png'}
        tags={preview.tags}
        dateLabel={start.isoDate}
        timeLabel={start.timeString}
        timezoneLabel={start.timeZone}
        location={preview.location.address}
        price={price}
        ageRestriction={AGE_RANGE_LABEL[preview.ageRestriction as AgeRangeValue]}
        description={preview.eventDescription}
      />
    </div>
  );
}
