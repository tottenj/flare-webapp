'use client';

import { PRICE_TYPE_LABEL, PriceTypeValue } from '@/lib/types/PriceType';
import EventCardPresentational from './EventCardPresentational';
import { AGE_RANGE_LABEL, AgeRangeValue } from '@/lib/types/AgeRange';

interface EventCardPreviewWrapperProps {
  formData: FormData;
  imgUrl: string | null;
  orgName?: string;
}

export default function EventCardPreviewWrapper({
  formData,
  imgUrl,
  orgName,
}: EventCardPreviewWrapperProps) {
  const get = (key: string) => String(formData.get(key) ?? '');

  const title = get('eventName');
  const description = get('eventDescription');

  const rawPriceType = get('priceType');
  const priceType: PriceTypeValue =
    rawPriceType && rawPriceType in PRICE_TYPE_LABEL ? (rawPriceType as PriceTypeValue) : 'FREE';
  const priceLabel = PRICE_TYPE_LABEL[priceType] ?? 'N/A';

  const rawAgeRestriction = get('ageRestriction');
  const ageRestriction: AgeRangeValue =
    rawAgeRestriction && rawAgeRestriction in AGE_RANGE_LABEL
      ? (rawAgeRestriction as AgeRangeValue)
      : 'ALL_AGES';
  const ageRestrictionLabel = AGE_RANGE_LABEL[ageRestriction];

  const startRaw = get('startDateTime');

  const endRaw = get('endDate');
  const dateLabel = startRaw ? new Date(startRaw).toLocaleDateString() : 'Date TBD';
  const timeLabel = startRaw
    ? new Date(startRaw).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';
  let locationLabel = 'Location TBD';
  const rawTags = get('tags');
  const tags: string[] = rawTags ? JSON.parse(String(rawTags)) : [];

  try {
    const loc = formData.get('location');
    if (loc) {
      const parsed = JSON.parse(String(loc));
      locationLabel = parsed.address ?? 'Custom Location';
    }
  } catch {
    locationLabel = 'Location TBD';
  }

  return (
    <div className="p-4">
      <EventCardPresentational
        title={title || 'Untitled Event'}
        organizer={orgName ?? 'Your Organization'}
        image={imgUrl ?? '/placeholder-event.png'}
        tags={tags}
        dateLabel={dateLabel}
        timeLabel={timeLabel}
        timezoneLabel="EST"
        location={locationLabel}
        price={priceLabel}
        ageRestriction={ageRestrictionLabel}
        description={description || 'No description yet.'}
      />
    </div>
  );
}
