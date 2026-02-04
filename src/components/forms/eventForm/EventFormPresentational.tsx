'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import { EventFileKey } from '@/components/forms/eventForm/EventFormContainer';
import TagAutoComplete from '@/components/inputs/autocomplete/tagAutocomplete/TagAutoComplete';
import FileInput from '@/components/inputs/file/FileInput';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import ImageCropper from '@/components/inputs/image/ImageCropper';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import MainModal from '@/components/modals/MainModal/MainModal';
import FileFormProps from '@/lib/types/FileFormProps';
import LocationFormProps from '@/lib/types/LocationFormProps';
import { Form } from '@heroui/react';

interface EventFormPresentationalProps extends LocationFormProps, FileFormProps<EventFileKey> {
  onRawFileSelected: (file: File) => void;
  cropImageUrl: string | null;
  isCropOpen: boolean;
  onCropped: (file: File, previewUrl: string) => void;
}

export default function EventFormPresentational({
  changeLocVal,
  cropImageUrl,
  onCropped,
  isCropOpen,
  onRawFileSelected,
  hasFile,
}: EventFormPresentationalProps) {
  return (
    <Form className="flex flex-col items-center gap-4 p-4">
      <FileInput
        buttonText="Event Image"
        fileAdded={hasFile('eventImg')}
        onChange={onRawFileSelected}
        name="eventImg"
      />

      {isCropOpen && cropImageUrl && (
        <MainModal>
          <ImageCropper
            imageUrl={cropImageUrl}
            aspect={3 / 4}
            outputWidth={600}
            setImg={(file) => onCropped(file!, cropImageUrl)}
            setImgURL={() => {}}
          />
        </MainModal>
      )}

      <HeroInput label="Event Name" name="eventName" placeholder="Enter event name" required />
      <HeroTextArea
        label="Event Description"
        name="eventDescription"
        placeholder="Enter event description"
        required
      />
      <PlaceSearch label="Event Location" onChange={changeLocVal} required />
      <TagAutoComplete />
      <PrimaryButton type="submit" />
    </Form>
  );
}
