'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import EventCardPreviewWrapper from '@/components/events/EventCard/EventCardPreviewWrapper';
import EventFormPresentational from '@/components/forms/eventForm/EventFormPresentational';
import MainModal from '@/components/modals/MainModal/MainModal';
import { ClientError } from '@/lib/errors/clientErrors/ClientError';
import { ClientErrors } from '@/lib/errors/clientErrors/ClientErrors';
import useEventForm from '@/lib/hooks/useEventForm/useEventForm';
import useFileMap from '@/lib/hooks/useFileMap/useFileMap';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import { CreateEvent } from '@/lib/schemas/event/createEventFormSchema';
import validateFileInput from '@/lib/schemas/validateFileInput';
import createEvent from '@/lib/serverActions/events/createEvent/createEvent';
import { ActionResult } from '@/lib/types/ActionResult';
import { EventFormInitialData, EventFormMode } from '@/lib/types/EventForm/EventForm';
import { basicFileUpload } from '@/lib/utils/other/basicFileUpload';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
export type EventFileKey = 'eventImg';

type EventSubmitAction = (input: CreateEvent) => Promise<ActionResult<null>>;

const MODE_COPY: Record<
  EventFormMode,
  {
    toast: { success: string; loading: string; error: string };
    submitText: string;
    draftText: string;
    publishText: string;
  }
> = {
  create: {
    toast: {
      success: 'Created Event',
      loading: 'Creating Event',
      error: 'Error Creating Event',
    },
    submitText: 'Preview Event',
    draftText: 'Save as Draft',
    publishText: 'Publish Event',
  },
  edit: {
    toast: {
      success: 'Updated Event',
      loading: 'Updating Event',
      error: 'Error Updating Event',
    },
    submitText: 'Preview Changes',
    draftText: 'Save Draft Changes',
    publishText: 'Save Changes',
  },
};

function isBlobUrl(url: string) {
  return url.startsWith('blob:');
}

export default function EventFormContainer({
  orgName,
  onCloseModal,
  mode = 'create',
  submitAction = createEvent,
  initialEvent,
  initialImage,
}: {
  orgName?: string;
  onCloseModal?: () => void;
  mode?: EventFormMode;
  submitAction?: EventSubmitAction;
  initialEvent?: EventFormInitialData;
  initialImage?: {
    previewUrl: string;
    metadata: ImageMetadata;
  };
}) {
  const {
    location,
    setLocation,
    hasEndTime,
    setHasEndTime,
    priceType,
    setPriceType,
    previewErrors,
    pendingFormData,
    previewOpen,
    setPreviewOpen,
    handlePreview,
  } = useEventForm({
    location: initialEvent?.location,
    hasEndTime: Boolean(initialEvent?.endDateTime),
    priceType: initialEvent?.priceType,
  });
  const { files, setFile } = useFileMap<EventFileKey>({
    initial: {
      eventImg: null,
    },
  });
  const [eventImgPreview, setEventImgPreview] = useState<string | null>(
    initialImage?.previewUrl ?? null
  );
  const [imgError, setImgError] = useState<string | null>(null);
  const router = useRouter();
  const copy = MODE_COPY[mode];

  useEffect(() => {
    return () => {
      if (eventImgPreview && isBlobUrl(eventImgPreview)) {
        URL.revokeObjectURL(eventImgPreview);
      }
    };
  }, [eventImgPreview]);

  async function confirmSubmit(isDraft = false) {
    if (!pendingFormData) return;
    const eventImg = files.eventImg;
    let metadata: ImageMetadata | null = initialImage?.metadata ?? null;

    if (eventImg) {
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
    }

    if (!metadata) {
      setImgError('Event image is required');
      return;
    }

    await action({ image: metadata, status: isDraft ? 'DRAFT' : 'PUBLISHED', ...pendingFormData });
  }

  const { action, pending, validationErrors, error } = useFormAction(submitAction, {
    toast: copy.toast,
    onSuccess: () => {
      setPreviewOpen(false);
      onCloseModal?.();
      router.refresh();
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  function handleCropped(file: File, previewUrl: string) {
    if (eventImgPreview && isBlobUrl(eventImgPreview)) {
      URL.revokeObjectURL(eventImgPreview);
    }
    const error = validateFileInput({ file });
    if (error) {
      toast.error(error);
      return;
    }
    setFile('eventImg', file);
    setImgError(null);
    setEventImgPreview(previewUrl);
  }

  const mergedValidationErrors = {
    ...validationErrors,
    ...previewErrors,
  };

  return (
    <>
      <EventFormPresentational
        imgError={imgError}
        setImgError={setImgError}
        pending={pending}
        error={error?.message}
        validationErrors={mergedValidationErrors}
        changeLocVal={setLocation}
        locVal={location}
        eventImgPreview={eventImgPreview}
        onImageCropped={handleCropped}
        hasEndTime={hasEndTime}
        setHasEndTime={setHasEndTime}
        setPriceType={setPriceType}
        priceType={priceType}
        handlePreview={handlePreview}
        submitText={copy.submitText}
        initialEvent={initialEvent}
      />
      {previewOpen && pendingFormData && (
        <MainModal modalProps={{ size: '5xl' }} isOpen onClose={() => setPreviewOpen(false)}>
          <EventCardPreviewWrapper
            preview={pendingFormData}
            imgUrl={eventImgPreview}
            orgName={orgName}
          />
          <div className="mr-auto ml-auto flex h-full w-full flex-col items-center justify-center md:w-3/4 md:flex-row md:gap-8">
            <Button
              onPress={() => confirmSubmit(true)}
              className="bg-secondary mt-4 w-full p-6 text-white md:w-1/2"
            >
              {copy.draftText}
            </Button>
            <div className="w-full md:w-1/2">
              <PrimaryButton
                centered
                styleOver={{ width: 'full' }}
                text={copy.publishText}
                click={() => confirmSubmit(false)}
              />
            </div>
          </div>
        </MainModal>
      )}
    </>
  );
}
