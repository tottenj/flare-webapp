'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import FormError from '@/components/errors/Formerror/FormError';
import { EventFileKey } from '@/components/forms/eventForm/EventFormContainer';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import ImageCropperInput from '@/components/inputs/image/ImageCropper/ImageCropperInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import EventCategorySelect from '@/components/inputs/hero/selects/eventCategorySelect/EventCategorySelect';
import FileFormProps from '@/lib/types/FileFormProps';
import LocationFormProps from '@/lib/types/LocationFormProps';
import { Form } from '@heroui/react';
import TagAutoComplete from '@/components/inputs/hero/autocomplete/tagAutocomplete/TagAutoComplete';
import HeroCheckBox from '@/components/inputs/hero/checkbox/HeroCheckBox';
import HeroDateInput from '@/components/inputs/hero/date/HeroDateInput';
import HeroTimeInput from '@/components/inputs/hero/time/HeroTimeInput';
import HeroSelect from '@/components/inputs/hero/selects/HeroSelect';
import AgeRestrictionSelect from '@/components/inputs/hero/selects/ageRestrictionSelect/AgeRestrictionSelect';

interface EventFormPresentationalProps extends LocationFormProps, FileFormProps<EventFileKey> {
  eventImgPreview: string | null;
  onImageCropped: (file: File, previewUrl: string) => void;
  isMultiDay: boolean;
  setIsMultiDay: (isMulti: boolean) => void;
  hasEndTime: boolean;
  setHasEndTime: (endTime: boolean) => void;
}

export default function EventFormPresentational({
  changeLocVal,
  eventImgPreview,
  onImageCropped,
  onSubmit,
  validationErrors,
  error,
  pending,
  isMultiDay,
  setIsMultiDay,
  hasEndTime,
  setHasEndTime,
}: EventFormPresentationalProps) {
  return (
    <Form
      action={onSubmit}
      validationErrors={validationErrors}
      className="flex flex-col items-center gap-4 p-4"
    >
      {eventImgPreview && <img src={eventImgPreview} className="w-full max-w-3xs rounded-xl" />}
      <FormError error={error} />

      <ImageCropperInput required label="Event Image" aspect={2 / 3} onCropped={onImageCropped} />

      <HeroInput label="Event Name" name="eventName" placeholder="Enter event name" required />
      <HeroTextArea
        label="Event Description"
        name="eventDescription"
        placeholder="Enter event description"
        required
      />
      <PlaceSearch label="Event Location" onChange={changeLocVal} required />
      <TagAutoComplete />

      <div className="flex w-full gap-8">
        <HeroDateInput isRequired label="Date" name="startDateTime" withTime />
        {hasEndTime && <HeroTimeInput label="End Time" name="endTime" />}
        {isMultiDay && <HeroDateInput label="End Date" name="endDate" />}
      </div>
      <div className="flex gap-8">
        <HeroCheckBox isSelected={hasEndTime} onValueChange={setHasEndTime}>
          Has End Time
        </HeroCheckBox>
        <HeroCheckBox isSelected={isMultiDay} onValueChange={setIsMultiDay}>
          Is Multi-Day
        </HeroCheckBox>
      </div>

      <EventCategorySelect required />

      <div className="flex w-full gap-4">
        <AgeRestrictionSelect required />
      </div>

      <PrimaryButton type="submit" disabled={pending} />
    </Form>
  );
}
