'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import { EventFileKey } from '@/components/forms/eventForm/EventFormContainer';
import TagAutoComplete from '@/components/inputs/autocomplete/tagAutocomplete/TagAutoComplete';
import FileInput from '@/components/inputs/file/FileInput';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import ImageCropperInput from '@/components/inputs/image/ImageCropper/ImageCropperInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import FileFormProps from '@/lib/types/FileFormProps';
import LocationFormProps from '@/lib/types/LocationFormProps';
import { Form } from '@heroui/react';

interface EventFormPresentationalProps extends LocationFormProps, FileFormProps<EventFileKey> {
  eventImgPreview: string | null;
  onImageCropped: (file: File, previewUrl: string) => void;
}

export default function EventFormPresentational({
  changeLocVal,
  eventImgPreview,
  onImageCropped,
  hasFile
}: EventFormPresentationalProps) {
  return (
    <Form className="flex flex-col items-center gap-4 p-4">
      {eventImgPreview && <img src={eventImgPreview} className="w-full max-w-3xs rounded-xl" />}

      <ImageCropperInput label="Event Image" aspect={2 / 3} onCropped={onImageCropped} />

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
