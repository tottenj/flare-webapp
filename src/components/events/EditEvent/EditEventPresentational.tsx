'use client';
import EventFormContainer from '@/components/forms/eventForm/EventFormContainer';
import mapEditEventDataToInitialFormData from '@/lib/mappers/mapEditEventDataToInitialFormData/mapEditEventDataToInitialFormData';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import type { EventDto } from '@/lib/schemas/event/eventDtoSchema';

export default function EditEventPresentational({
  event,
  orgName,
  imageURL,
  locationDetails,
  close,
}: {
  event: EventDto;
  orgName?: string;
  imageURL?: string;
  locationDetails?: LocationInput;
  close?: () => void;
}) {
  const initialEvent = mapEditEventDataToInitialFormData({
    event,
    imageUrl: imageURL,
    location: locationDetails,
  });

  return (
    <EventFormContainer
      mode="edit"
      initialEvent={initialEvent}
      orgName={orgName}
      onCloseModal={close}
    />
  );
}
