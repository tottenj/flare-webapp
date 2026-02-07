'use client';
import EventFormPresentational from '@/components/forms/eventForm/EventFormPresentational';
import useFileMap from '@/lib/hooks/useFileMap/useFileMap';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { ActionResult } from '@/lib/types/ActionResult';
import { useState } from 'react';
import { toast } from 'react-toastify';

export type EventFileKey = 'eventImg';

export default function EventFormContainer() {
  const [location, setLocation] = useState<LocationInput | null>(null);
  const { files, hasFile, setFile } = useFileMap<EventFileKey>({
    initial: {
      eventImg: null,
    },
  });
  const [eventImgPreview, setEventImgPreview] = useState<string | null>(null);

  async function submitAction(formData: FormData): Promise<ActionResult<null>> {
    const eventImg = files.eventImg;
    return { ok: true, data: null };
  }

  const { action, pending, error, validationErrors } = useFormAction(submitAction, {
    onSuccess: () => {
      toast.success('Created Account');
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
      hasFile={hasFile}
      onSubmit={action}
      handleFileChange={onFileChange}
      pending={pending}
      error={error?.message}
      validationErrors={validationErrors}
      eventImgPreview={eventImgPreview}
      onImageCropped={handleCropped}
    />
  );
}
