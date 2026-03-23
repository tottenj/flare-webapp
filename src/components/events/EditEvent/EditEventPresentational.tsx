'use client';
import EventFormContainer from '@/components/forms/eventForm/EventFormContainer';
import MainModal from '@/components/modals/MainModal/MainModal';
import mapEventDtoToInitialFormData from '@/lib/mappers/mapEventDtoToInitialFormData/mapEventDtoToInitialFormData';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { EventDto } from '@/lib/types/dto/EventDto';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const initialEvent = mapEventDtoToInitialFormData(event, imageURL);

  return (
    <EventFormContainer
      mode="edit"
      initialEvent={initialEvent}
      orgName={orgName}
      onCloseModal={close}
    />
  );
}
