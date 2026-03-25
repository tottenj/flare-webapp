'use client';
import IconButton from '@/components/buttons/iconButton/IconButton';
import EditEventPresentational from '@/components/events/EditEvent/EditEventPresentational';
import MainModal from '@/components/modals/MainModal/MainModal';
import Skeleton from '@/components/skeletons/BaseSkeleton/BaseSkeleton';
import { ClientError } from '@/lib/errors/clientErrors/ClientError';
import { ClientErrors } from '@/lib/errors/clientErrors/ClientErrors';
import fetchEditData from '@/lib/fetch/fetchEditData/fetchEditData';
import { EditEventData } from '@/lib/schemas/event/editEventDataSchema';
import { EventDto } from '@/lib/types/dto/EventDto';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function EditEventContainer({
  event,
  orgName,
}: {
  event: EventDto;
  orgName?: string;
}) {
  const [data, setData] = useState<EditEventData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    if (loading) return;
    setError(null);
    setData(null);
    setLoading(true);
    try {
      const result = await fetchEditData(event.id);
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
            imageURL={data?.imageUrl}
            locationDetails={data?.location}
            close={close}
          />
        )
      }
    </MainModal>
  );
}
