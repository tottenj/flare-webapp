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
import LocationFormProps from '@/lib/types/location/LocationFormProps';
import { Form } from '@heroui/react';
import TagAutoComplete from '@/components/inputs/hero/autocomplete/tagAutocomplete/TagAutoComplete';
import HeroCheckBox from '@/components/inputs/hero/checkbox/HeroCheckBox';
import HeroDateInput from '@/components/inputs/hero/date/HeroDateInput';
import AgeRestrictionSelect from '@/components/inputs/hero/selects/ageRestrictionSelect/AgeRestrictionSelect';
import { PriceTypeValue } from '@/lib/types/PriceType';
import PriceTypeSelect from '@/components/inputs/hero/selects/priceTypeSelect/PriceTypeSelect';
import PriceInput from '@/components/inputs/hero/number/priceInput/PriceInput';
import { EventFormInitialData } from '@/lib/types/EventForm/EventForm';

interface EventFormPresentationalProps extends LocationFormProps, FileFormProps<EventFileKey> {
  eventImgPreview: string | null;
  onImageCropped: (file: File, previewUrl: string) => void;
  hasEndTime: boolean;
  setHasEndTime: (endTime: boolean) => void;
  priceType: PriceTypeValue;
  setPriceType: (price: PriceTypeValue) => void;
  handlePreview: (fd: FormData) => void;
  imgError: string | null;
  setImgError: (error: string | null) => void;
  submitText?: string;
  initialEvent?: EventFormInitialData;
}

export default function EventFormPresentational({
  changeLocVal,
  eventImgPreview,
  onImageCropped,
  validationErrors,
  error,
  hasEndTime,
  setHasEndTime,
  setPriceType,
  priceType,
  handlePreview,
  imgError,
  setImgError,
  submitText,
  initialEvent,
}: EventFormPresentationalProps) {
  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (!eventImgPreview) {
            setImgError('Event image is required');
            return;
          } else {
            setImgError(null);
          }
          const fd = new FormData(e.currentTarget);
          handlePreview(fd);
        }}
        validationErrors={validationErrors}
        className="flex flex-col items-center gap-4 p-4"
      >
        <img
          src={eventImgPreview || '/imagePlaceholder.png'}
          className="w-full max-w-3xs rounded-xl"
        />
        <FormError error={error} />
        {imgError && <FormError error={imgError} />}
        <ImageCropperInput label="Event Image" aspect={2 / 3} onCropped={onImageCropped} />

        <HeroInput
          label="Event Name"
          name="eventName"
          placeholder="Enter event name"
          required
          defaultValue={initialEvent?.eventName}
        />
        <HeroTextArea
          label="Event Description"
          name="eventDescription"
          placeholder="Enter event description"
          required
          defaultValue={initialEvent?.eventDescription}
        />
        <PlaceSearch
          label="Event Location"
          onChange={changeLocVal}
          value={initialEvent?.location}
        />
        <TagAutoComplete initialValues={initialEvent?.tags} />

        <div className="flex w-full gap-8">
          <HeroDateInput
            isRequired
            label="Date"
            name="startDateTime"
            withTime
            defaultValue={initialEvent?.startDateTime}
          />
          {hasEndTime && (
            <HeroDateInput
              label="End Date / Time"
              name="endDateTime"
              error={validationErrors?.endDateTime?.[0]}
              withTime
              defaultValue={initialEvent?.endDateTime}
            />
          )}
        </div>
        <div className="flex gap-8">
          <HeroCheckBox name="endTime" isSelected={hasEndTime} onValueChange={setHasEndTime}>
            Set end date / time
          </HeroCheckBox>
        </div>

        <EventCategorySelect defaultValue={initialEvent?.category} required />

        <div className="flex w-full gap-4">
          <AgeRestrictionSelect defaultValue={initialEvent?.ageRestriction} required />
        </div>
        <PriceTypeSelect onChange={setPriceType} value={priceType} />
        {priceType === 'FIXED' && (
          <PriceInput
            required
            description="Price"
            name="minPrice"
            defaultValue={initialEvent?.minPrice}
          />
        )}
        {priceType === 'RANGE' && (
          <div className="flex w-full gap-8">
            <PriceInput
              required
              description="Min Price"
              name="minPrice"
              defaultValue={initialEvent?.minPrice}
            />
            <PriceInput
              required
              description="Max Price"
              name="maxPrice"
              defaultValue={initialEvent?.maxPrice}
            />
          </div>
        )}
        <PrimaryButton type="submit" text={submitText} />
      </Form>
    </>
  );
}
