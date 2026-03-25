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
import { ActionResult } from '@/lib/types/responses/ActionResult';
import { EventFormInitialData, EventFormMode } from '@/lib/types/EventForm/EventForm';
import { basicFileUpload } from '@/lib/utils/other/basicFileUpload';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
export type EventFileKey = 'eventImg';

type EventSubmitAction = (input: CreateEvent) => Promise<ActionResult<null>>;
type ModeCopy = Record<
  EventFormMode,
  {
    toast: { success: string; loading: string; error: string };
    submitText: string;
    draftText: string;
    publishText: string;
  }
>;

const MODE_COPY: ModeCopy = {
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

export default function EventFormContainer({
  orgName,
  onCloseModal,
  mode = 'create',
  submitAction = createEvent,
  initialEvent,
}: {
  orgName?: string;
  onCloseModal?: () => void;
  mode?: EventFormMode;
  submitAction?: EventSubmitAction;
  initialEvent?: EventFormInitialData;
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
    imgError,
    setImgError,
    eventImgPreview,
    setEventImgPreview,
  } = useEventForm({
    imgPreview: initialEvent?.imageDetails?.url ?? null,
  });

  const { files, setFile } = useFileMap<EventFileKey>({
    initial: {
      eventImg: null,
    },
  });

  const router = useRouter();
  const copy = MODE_COPY[mode];

  async function confirmSubmit(isDraft = false) {
    if (!pendingFormData) return;
    const eventImg = files.eventImg;
    let metadata: ImageMetadata | null = null;
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
    } else if (mode === 'edit' && initialEvent?.imageDetails?.storagePath) {
      metadata = {
        storagePath: initialEvent.imageDetails.storagePath,
      };
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
