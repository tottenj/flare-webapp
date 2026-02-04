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
  
  async function submitAction(formData: FormData): Promise<ActionResult<null>> {
    return { ok: true, data: null };
  }

  const { action, pending, error, validationErrors } = useFormAction(submitAction, {
    onSuccess: () => {
      toast.success('Created Account');
    },
  });

  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  function onRawFileSelected(file: File) {
    const url = URL.createObjectURL(file);
    setCropImageUrl(url);
    setIsCropOpen(true);
  }

  function onCropped(file: File, previewUrl: string) {
    setFile('eventImg', file);
    setCropImageUrl(null);
    setIsCropOpen(false);
  }

  function onFileChange(key: EventFileKey, file: File) {
    setFile(key, file);
  }

 

  return (
    <EventFormPresentational
      changeLocVal={setLocation}
      locVal={location}
      hasFile={hasFile}
      onRawFileSelected={onRawFileSelected}
      cropImageUrl={cropImageUrl}
      isCropOpen={isCropOpen}
      onCropped={onCropped}
      onSubmit={submitAction}
      handleFileChange={onFileChange}
      pending={pending}
      error={error?.message}
      validationErrors={validationErrors}
    />
  );
}
