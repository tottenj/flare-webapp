'use client';

import { PRICE_TYPE_LABEL, PriceTypeValue } from '@/lib/types/PriceType';
import EventCardPresentational from './EventCardPresentational';
import { AGE_RANGE_LABEL, AgeRangeValue } from '@/lib/types/AgeRange';
import { CreateEventPreviewForm } from '@/lib/schemas/event/createEventPreviewFormSchema';
import { parseZonedDateTime } from '@internationalized/date';

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
   const dt = parseZonedDateTime(preview.startDateTime);
   const dateLabel = dt.toDate().toLocaleDateString();
   const timeLabel = dt.toDate().toLocaleTimeString([], {
     hour: '2-digit',
     minute: '2-digit',
   });

  return (
    <div className="p-4">
      <EventCardPresentational
        title={preview.eventName}
        organizer={orgName ?? 'Your Organization'}
        image={imgUrl ?? '/placeholder-event.png'}
        tags={preview.tags}
        dateLabel={dateLabel}
        timeLabel={timeLabel}
        timezoneLabel={dt.timeZone}
        location={preview.location.address}
        price={PRICE_TYPE_LABEL[preview.priceType as PriceTypeValue]}
        ageRestriction={AGE_RANGE_LABEL[preview.ageRestriction as AgeRangeValue]}
        description={preview.eventDescription}
      />
    </div>
  );
}
