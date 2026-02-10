'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import EventCardPreviewWrapper from '@/components/events/EventCard/EventCardPreviewWrapper';
import EventFormPresentational from '@/components/forms/eventForm/EventFormPresentational';
import MainModal from '@/components/modals/MainModal/MainModal';
import useFileMap from '@/lib/hooks/useFileMap/useFileMap';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import createEvent from '@/lib/serverActions/events/createEvent/createEvent';
import { ActionResult } from '@/lib/types/ActionResult';
import { PriceTypeValue } from '@/lib/types/PriceType';
import { useState } from 'react';
export type EventFileKey = 'eventImg';

export default function EventFormContainer({ orgName }: { orgName?: string }) {
  const [location, setLocation] = useState<LocationInput | null>(null);
  const { files, setFile } = useFileMap<EventFileKey>({
    initial: {
      eventImg: null,
    },
  });
  const [eventImgPreview, setEventImgPreview] = useState<string | null>('/imagePlaceholder.png');
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [hasEndTime, setHasEndTime] = useState(false);
  const [priceType, setPriceType] = useState<PriceTypeValue>('FREE');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [minPrice, setMinPrice] = useState<number>(10)
  const [maxPrice, setMaxPrice] = useState<number>(20)

  function handlePreview(formData: FormData) {
    setPendingFormData(formData);
    console.log(formData);
    setPreviewOpen(true);
  }

  async function confirmSubmit() {
    if (!pendingFormData) return;
    await action(pendingFormData);
    setPreviewOpen(false);
  }

  async function submitAction(formData: FormData): Promise<ActionResult<null>> {
    const eventImg = files.eventImg;
    formData.delete('image');
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
    <>
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
        setPriceType={setPriceType}
        priceType={priceType}
        handlePreview={handlePreview}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        setMinPrice={setMinPrice}
      />
      {previewOpen && pendingFormData && (
        <MainModal modalProps={{ size: '5xl' }} isOpen onClose={() => setPreviewOpen(false)}>
          <EventCardPreviewWrapper
            formData={pendingFormData}
            imgUrl={eventImgPreview}
            orgName={orgName}
          />
          <PrimaryButton centered text="Publish Event" click={confirmSubmit} />
        </MainModal>
      )}
    </>
  );
}
