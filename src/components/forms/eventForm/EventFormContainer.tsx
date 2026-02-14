'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import EventCardPreviewWrapper from '@/components/events/EventCard/EventCardPreviewWrapper';
import EventFormPresentational from '@/components/forms/eventForm/EventFormPresentational';
import MainModal from '@/components/modals/MainModal/MainModal';
import { ClientError } from '@/lib/errors/clientErrors/ClientError';
import { ClientErrors } from '@/lib/errors/clientErrors/ClientErrors';
import { extractFieldErrors } from '@/lib/errors/extractError';
import useFileMap from '@/lib/hooks/useFileMap/useFileMap';
import { useFormAction } from '@/lib/hooks/useFormAction';
import {
  CreateEventPreviewForm,
  parsePreviewFormData,
} from '@/lib/schemas/event/createEventPreviewFormSchema';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import validateFileInput from '@/lib/schemas/validateFileInput';
import createEvent from '@/lib/serverActions/events/createEvent/createEvent';
import { PriceTypeValue } from '@/lib/types/PriceType';
import { basicFileUpload } from '@/lib/utils/other/basicFileUpload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import z from 'zod';
export type EventFileKey = 'eventImg';

export default function EventFormContainer({
  orgName,
  onCloseModal,
}: {
  orgName?: string;
  onCloseModal?: () => void;
}) {
  const [location, setLocation] = useState<LocationInput | null>(null);
  const { files, setFile } = useFileMap<EventFileKey>({
    initial: {
      eventImg: null,
    },
  });
  const [eventImgPreview, setEventImgPreview] = useState<string | null>('/imagePlaceholder.png');
  const [hasEndTime, setHasEndTime] = useState(false);
  const [priceType, setPriceType] = useState<PriceTypeValue>('FREE');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<CreateEventPreviewForm | null>(null);
  const [minPrice, setMinPrice] = useState<number>(5);
  const [maxPrice, setMaxPrice] = useState<number>(20);
  const router = useRouter()

  function handlePreview(formData: FormData) {
    const result = parsePreviewFormData(formData);
    if (!result.success) {
      console.log(extractFieldErrors(z.treeifyError(result.error)));
      return;
    }
    setPendingFormData(result.data);
    setPreviewOpen(true);
  }

  async function confirmSubmit() {
    if (!pendingFormData) return;
    const eventImg = files.eventImg;
    if (!eventImg) return;
    let metadata: ImageMetadata | null = null;
    try {
      metadata = await basicFileUpload(eventImg, 'events');
    } catch (error) {
      if (error instanceof ClientError) {
        toast.error(error.message);
      } else {
        toast.error(ClientErrors.UploadFailed().message);
      }
      return;
    }
    await action({ image: metadata, ...pendingFormData });
  }

  const { action, pending, validationErrors, error } = useFormAction(createEvent, {
    toast: {
      success: 'Created Event',
      loading: 'Creating Event',
      error: 'Error Creating Event',
    },
    onSuccess: () => {
      setPreviewOpen(false);
      onCloseModal?.()
      router.refresh()
    },
  });

  function handleCropped(file: File, previewUrl: string) {
    if (eventImgPreview) {
      URL.revokeObjectURL(eventImgPreview);
    }
    const error = validateFileInput({ file });
    if (error) {
      toast.error(error);
      return;
    }
    setFile('eventImg', file);
    setEventImgPreview(previewUrl);
  }

  return (
    <>
      <EventFormPresentational
        pending={pending}
        error={error?.message}
        validationErrors={validationErrors}
        changeLocVal={setLocation}
        locVal={location}
        eventImgPreview={eventImgPreview}
        onImageCropped={handleCropped}
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
            preview={pendingFormData}
            imgUrl={eventImgPreview}
            orgName={orgName}
          />
          <PrimaryButton centered text="Publish Event" click={confirmSubmit} />
        </MainModal>
      )}
    </>
  );
}
