'use client';
import { Form } from '@heroui/form';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import HeroDateRangeInput from '@/components/inputs/hero/dateRange/HeroDateRangeInput';

import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';

import PrimaryLabel from '@/components/inputs/labels/primaryLabel/PrimaryLabel';

import Modal from '@/components/modals/mainModal/MainModal';

export default function AddEventFormHero({ close }: { close?: () => void }) {
  return (
    <>
      <h1 className="mb-6 text-center">Add Event</h1>
      <Form autoCapitalize="words" className="flex flex-col gap-6" id="addEvent">
        <HeroInput label="Event Title" name="title" isRequired />
        <HeroTextArea label="Event Description" name="description" isRequired />

        <div className="flex w-full gap-4">
          <div className="w-1/2">
            {/*<HeroFileInput setImgUrl={setImgUrl} setImg={setImg} label="Event Image" /> */}
          </div>
          <div className="w-1/2">
            <HeroDateRangeInput startName="start" endName="end" label="Event Date" />
          </div>
        </div>

        {/*
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
          */}

        <div className="w-full">
          <PlaceSearch z="z-50" label="Event Location" required onChange={() => {}} />
        </div>

        <PrimaryLabel label="Additional Information" />
        <div className="flex w-full items-center gap-4">
          <div className="w-1/2">{/*<TypeSelect required /> */}</div>

          <div className="w-1/2">
            {/*
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
            */}
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
        <PrimaryButton text="Preview Event" type="button" />

        <Modal>
          <>
            {/* <EventInfo event={previewData} img={imgUrl} seen={false} /> */}
            <PrimaryButton type="submit" text="Create Event" form="addEvent" />
          </>
        </Modal>
      </Form>
    </>
  );
}
