'use client';
import { Form } from '@heroui/form';
import useCustomUseForm from '@/lib/hooks/useForm/useCustomUseForm';
import addEvent from '@/lib/formActions/addEvent/addEvent';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import HeroDateRangeInput from '@/components/inputs/hero/dateRange/HeroDateRangeInput';
import HeroFileInput from '@/components/inputs/hero/fileInput/HeroFileInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import HeroSelect from '@/components/inputs/hero/select/HeroSelect';
import { SelectItem } from '@heroui/react';
import AgeGroup from '@/lib/enums/AgeGroup';
import PrimaryLabel from '@/components/inputs/labels/primaryLabel/PrimaryLabel';
import TypeSelect from '@/components/inputs/hero/select/TypeSelect';
import Modal from '@/components/modals/mainModal/MainModal';
import ImageCropper from '@/components/inputs/image/ImageCropper';
import useImage from '@/lib/hooks/useImage';
import usePreview from '@/lib/hooks/usePreview';
import EventInfo from '@/components/events/eventInfo/EventInfo';
import { useEffect } from 'react';
import Event from '@/lib/classes/event/Event';
import { storage } from '@/lib/firebase/auth/configs/clientApp';
import { useRouter } from 'next/navigation';

export default function AddEventFormHero({ close }: { close?: () => void }) {
  const { action, state, pending } = useCustomUseForm(addEvent, 'Success', undefined, close);
  const { img, setImg, imgUrl, setImgUrl } = useImage(state.status, pending);
  const { previewData, handlePreviewClick, setPreviewData } = usePreview();
  const router = useRouter();
  useEffect(() => {
    (async () => {
      if (state.status == 'success' && state.eventId && img) {
        Event.uploadImages(state.eventId, storage, [img]);
        router.refresh();
      }
    })();
  }, [state]);

  return (
    <>
      <h1 className="mb-6 text-center">Add Event</h1>
      <Form
        action={action}
        validationErrors={state.errors}
        autoCapitalize="words"
        className="flex flex-col gap-6"
        id="addEvent"
      >
        <HeroInput label="Event Title" name="title" isRequired />
        <HeroTextArea label="Event Description" name="description" isRequired />

        <div className="flex w-full gap-4">
          <div className="w-1/2">
            <HeroFileInput setImgUrl={setImgUrl} setImg={setImg} label="Event Image" />
          </div>
          <div className="w-1/2">
            <HeroDateRangeInput startName="start" endName="end" label="Event Date" />
          </div>
        </div>

        {imgUrl && (
          <ImageCropper
            imageUrl={imgUrl}
            originalFileName={img?.name}
            aspect={3 / 4}
            outputWidth={600}
            setImgURL={setImgUrl}
            setImg={setImg}
          />
        )}

        <div className="w-full">
          <PlaceSearch z="z-50" lab="Event Location" required />
        </div>

        <PrimaryLabel label="Additional Information" />
        <div className="flex w-full items-center gap-4">
          <div className="w-1/2">
            <TypeSelect required />
          </div>

          <div className="w-1/2">
            <HeroSelect
              name="age"
              label="Age Range"
              defaultSelectedKeys={[Object.keys(AgeGroup)[0]]}
            >
              {Object.entries(AgeGroup).map(([key, value]) => (
                <SelectItem key={key} textValue={value}>
                  {value}
                </SelectItem>
              ))}
            </HeroSelect>
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="w-1/2">
            <HeroInput
              label="Price (Leave 0 for Free)"
              type="number"
              min={0}
              name="price"
              defaultValue={'0'}
            />
          </div>
          <div className="w-1/2">
            <HeroInput label="Link to Tickets" name="tickets" required={false} type="url" />
          </div>
        </div>
        <PrimaryButton
          disabled={pending}
          text="Preview Event"
          type="button"
          click={handlePreviewClick}
        />

        <Modal isOpen={!!previewData} onClose={() => setPreviewData(null)}>
          {previewData && (
            <>
              <EventInfo event={previewData} img={imgUrl} seen={false} />
              <PrimaryButton type="submit" text="Create Event" form="addEvent" />
            </>
          )}
        </Modal>
      </Form>
    </>
  );
}
