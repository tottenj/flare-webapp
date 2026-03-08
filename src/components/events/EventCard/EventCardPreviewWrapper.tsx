'use client';

import mapEventPreviewFormToEventCardViewModel from '@/lib/types/dto/mapEventPreviewFormToEventCardViewModel';
import EventCardPresentational from './presentational/EventCardPresentational';
import { CreateEventPreviewForm } from '@/lib/schemas/event/createEventPreviewFormSchema';

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
  const event = mapEventPreviewFormToEventCardViewModel(preview, orgName, imgUrl);

  return (
    <div className="p-4">
      <EventCardPresentational event={event} />
    </div>
  );
}
