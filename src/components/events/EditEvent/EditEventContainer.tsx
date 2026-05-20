'use client';
import IconButton from '@/components/buttons/iconButton/IconButton';
import EventFormContainer from '@/components/forms/eventForm/EventFormContainer';
import MainModal from '@/components/modals/MainModal/MainModal';
import Skeleton from '@/components/skeletons/BaseSkeleton/BaseSkeleton';
import { ClientError } from '@/lib/errors/clientErrors/ClientError';
import { ClientErrors } from '@/lib/errors/clientErrors/ClientErrors';
import fetchEditData from '@/lib/fetch/fetchEditData/fetchEditData';
import mapEditEventDataToInitialFormData from '@/lib/mappers/mapEditEventDataToInitialFormData/mapEditEventDataToInitialFormData';
import { EditEventData } from '@/lib/schemas/event/editEventDataSchema';
import { EditEventInput } from '@/lib/schemas/event/editEventInputSchema';
import { CreateEvent } from '@/lib/schemas/event/createEventFormSchema';
import editEvent from '@/lib/serverActions/events/updateEvent/updateEvent';
import { EventFormInitialData } from '@/lib/types/EventForm/EventForm';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function EditEventContainer({
  eventId,
  orgName,
}: {
  eventId: string;
  orgName?: string;
}) {
  const [data, setData] = useState<EditEventData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const result = await fetchEditData(eventId);
      setData(result);
    } catch (err) {
      if (err instanceof ClientError) {
        setError(err.message);
      } else {
        setError(ClientErrors.Network().message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainModal
      onOpen={loadData}
      onClose={() => {
        setError(null);
        setData(null);
      }}
      modalProps={{ size: '5xl' }}
      trigger={
        <IconButton
          className="absolute -top-4 -right-6 z-10"
          icon={faEdit}
          data-cy={`edit-event-trigger-${eventId}`}
        />
      }
    >
      {(close) => {
        if (loading) {
          return <Skeleton className="h-100 w-full rounded-xl" />;
        }

        if (error) {
          return (
            <div className="flex flex-col items-center gap-2 text-red-500">
              <p>{error}</p>
              <button onClick={loadData} className="underline">
                Try again
              </button>
            </div>
          );
        }

        if (!data) {
          return <Skeleton className="h-100 w-full rounded-xl" />;
        }

        const initialEvent = mapEditEventDataToInitialFormData(data);

        function buildSubmitAction(
          id: string,
          original: EventFormInitialData
        ): (input: CreateEvent) => ReturnType<typeof editEvent> {
          return (input: CreateEvent) => {
            const originalStoragePath = original.imageDetails?.metaData?.storagePath;
            const isNew = input.image.storagePath !== originalStoragePath;
            const editInput: EditEventInput = {
              ...input,
              image: isNew
                ? { isNew: true, metadata: input.image }
                : { isNew: false, storagePath: input.image.storagePath },
            };
            return editEvent(id, editInput);
          };
        }

        return (
          <EventFormContainer
            mode="edit"
            initialEvent={initialEvent}
            orgName={orgName}
            onCloseModal={close}
            submitAction={buildSubmitAction(eventId, initialEvent)}
          />
        );
      }}
    </MainModal>
  );
}
