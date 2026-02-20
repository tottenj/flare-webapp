'use client';

import mapEventPreviewFormToEventCardDto from '@/lib/types/dto/mapEventPreviewFormToEventCardDto';
import EventCardPresentational from './EventCardPresentational';
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
  const event = mapEventPreviewFormToEventCardDto(preview, orgName, imgUrl);

  return (
    <div className="p-4">
      <EventCardPresentational event={event} />
    </div>
  );
}
