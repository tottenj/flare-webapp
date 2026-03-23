'use client';
import IconButton from '@/components/buttons/iconButton/IconButton';
import EditEventPresentational from '@/components/events/EditEvent/EditEventPresentational';
import MainModal from '@/components/modals/MainModal/MainModal';
import Skeleton from '@/components/skeletons/BaseSkeleton/BaseSkeleton';
import { ClientError } from '@/lib/errors/clientErrors/ClientError';
import { ClientErrors } from '@/lib/errors/clientErrors/ClientErrors';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { ActionResult } from '@/lib/types/ActionResult';
import { EventDto } from '@/lib/types/dto/EventDto';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface EditEventFetchData {
  imageURL?: string;
  locationDetails?: LocationInput;
}

export default function EditEventContainer({
  event,
  orgName,
}: {
  event: EventDto;
  orgName?: string;
}) {
  const [data, setData] = useState<EditEventFetchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    if (loading) return;
    setError(null);
    setData(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}/edit-data`);
      const json = (await res.json()) as ActionResult<EditEventFetchData> | null;
      if (!res.ok) {
        if (res.status === 401) throw ClientErrors.SessionExpired();
        if (json && !json.ok) {
          throw ClientErrors.ServerRejected(json.error.message, json.error.code);
        }
        throw ClientErrors.ServerRejected('Failed to load event data. Please try again.');
      }
      if (!json || !json.ok) {
        throw ClientErrors.ServerRejected(json?.error.message ?? 'Invalid server response');
      }
      setData(json.data);
    } catch (error) {
      if (error instanceof ClientError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainModal
      onOpen={loadData}
      modalProps={{ size: '5xl' }}
      trigger={<IconButton icon={faEdit} />}
    >
      {(close) =>
        loading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <EditEventPresentational
            event={event}
            orgName={orgName}
            imageURL={data?.imageURL}
            locationDetails={data?.locationDetails}
            close={close}
          />
        )
      }
    </MainModal>
  );
}
