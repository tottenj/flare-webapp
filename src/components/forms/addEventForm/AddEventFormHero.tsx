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
import flareLocation from '@/lib/types/Location';
import React, { useState } from 'react';
import HeroSelect from '@/components/inputs/hero/select/HeroSelect';
import { SelectItem } from '@heroui/react';
import AgeGroup from '@/lib/enums/AgeGroup';
import PrimaryLabel from '@/components/inputs/labels/primaryLabel/PrimaryLabel';
import TypeSelect from '@/components/inputs/hero/select/TypeSelect';
import useUnifiedUser from '@/lib/hooks/useUnifiedUser';
import { convertFormData } from '@/lib/zod/convertFormData';
import { CreateEventSchema } from '@/lib/zod/event/createEventSchema';
import { toast } from 'react-toastify';
import Modal from '@/components/modals/mainModal/MainModal';
import Event from '@/lib/classes/event/Event';
import EventInfoSplit from '@/components/events/eventInfo/EventInfoSplit';
import getFormattedDateString from '@/lib/utils/dateTime/getFormattedDateString';

export default function AddEventFormHero({ close }: { close?: () => void }) {
  const { action, state, pending } = useCustomUseForm(addEvent, 'Success', undefined, close);
  const [loc, setloc] = useState<flareLocation | null>(null);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const { user } = useUnifiedUser();
  const [img, setImg] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');

  function handlePreviewClick(e: React.MouseEvent<HTMLButtonElement>): any {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget.form;
    if (!form) return;
    const formData = new FormData(form);
    console.log(formData.get("location"))
    const res = convertFormData(CreateEventSchema, formData);
    
    if (!res.success) {
      toast.error('Please Fill In All Required Fields');
      console.log(res.error)
    } else if (!user?.uid){
      toast.error("Authentication Error")
    }
    else {
      const { data } = res;
      const formattedDate = getFormattedDateString(data.startDate);

      setFormattedDate(formattedDate);
      setPreviewData(
        new Event({
          id: '123',
          flare_id: user.uid,
          verified: false,
          createdAt: new Date(),
          ...data,
        })
      );
    }
    if (img) {
      const objectUrl = URL.createObjectURL(img);
      setImgUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }

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
        <HeroTextArea label="Event Description" name="description" />

        <div className="flex w-full gap-4">
          <div className="w-1/2">
            <HeroFileInput setImg={setImg} label="Event Image" />
          </div>
          <div className="w-1/2">
            <HeroDateRangeInput startName="start" endName="end" label="Event Date" />
          </div>
        </div>

        <div className="w-full">
          <PlaceSearch z="z-50" loc={setloc} lab="Event Location" />
          {loc && (
            <input type="hidden" name="location" required={true} value={JSON.stringify(loc)} />
          )}
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
              <EventInfoSplit
                event={previewData}
                img={imgUrl}
                startDate={previewData.startDate ? previewData.startDate.toLocaleTimeString() : ''}
                formattedDate={formattedDate}
              />
              <PrimaryButton type="submit" text="Create Event" form="addEvent" />
            </>
          )}
        </Modal>
      </Form>
    </>
  );
}
