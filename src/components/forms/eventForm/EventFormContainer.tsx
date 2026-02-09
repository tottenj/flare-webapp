'use client';
import EventFormPresentational from '@/components/forms/eventForm/EventFormPresentational';
import useFileMap from '@/lib/hooks/useFileMap/useFileMap';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import createEvent from '@/lib/serverActions/events/createEvent/createEvent';
import { ActionResult } from '@/lib/types/ActionResult';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export type EventFileKey = 'eventImg';

export default function EventFormContainer() {
  const [location, setLocation] = useState<LocationInput | null>(null);
  const { files, setFile } = useFileMap<EventFileKey>({
    initial: {
      eventImg: null,
    },
  });
  const [eventImgPreview, setEventImgPreview] = useState<string | null>(null);
  const [isMultiDay, setIsMultiDay] = useState(false)
  const [hasEndTime, setHasEndTime] = useState(false)
  const router = useRouter()

  async function submitAction(formData: FormData): Promise<ActionResult<null>> {
    const eventImg = files.eventImg;
    await createEvent(formData);  
    return { ok: true, data: null };
  }

  const { action, pending, error, validationErrors } = useFormAction(submitAction, {
    toast: {
      success: 'Created Event',
      loading: 'Creating Event',
      error: 'Error Creating Event',
    },
  });

  function onFileChange(key: EventFileKey, file: File) {
    setFile(key, file);
  }

  function handleCropped(file: File, previewUrl: string) {
    if (eventImgPreview) {
      URL.revokeObjectURL(eventImgPreview);
    }
    setFile('eventImg', file);
    setEventImgPreview(previewUrl);
  }

  return (
    <EventFormPresentational
      changeLocVal={setLocation}
      locVal={location}
      onSubmit={action}
      handleFileChange={onFileChange}
      pending={pending}
      error={error?.message}
      validationErrors={validationErrors}
      eventImgPreview={eventImgPreview}
      onImageCropped={handleCropped}
      isMultiDay={isMultiDay}
      setIsMultiDay={setIsMultiDay}
      hasEndTime={hasEndTime}
      setHasEndTime={setHasEndTime}
    />
  );
}
