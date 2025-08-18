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
import { useState } from 'react';
import HeroSelect from '@/components/inputs/hero/select/HeroSelect';
import { SelectItem } from '@heroui/react';
import eventType, { colourOptions } from '@/lib/enums/eventType';
import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import AgeGroup from '@/lib/enums/AgeGroup';
import PrimaryLabel from '@/components/inputs/labels/primaryLabel/PrimaryLabel';

export default function AddEventFormHero({ close }: { close?: () => void }) {
  const { action, state, pending } = useCustomUseForm(addEvent, 'Success', undefined, close);

  const [loc, setloc] = useState<flareLocation | null>(null);
  return (
    <>
      <h1 className="mb-6 text-center">Add Event</h1>
      <Form
        action={action}
        validationErrors={state.errors}
        autoCapitalize="words"
        className="flex flex-col gap-6"
      >
        <HeroInput label="Event Title" name="title" isRequired />
        <HeroTextArea label="Event Description" name="description" />

        <div className="flex w-full gap-4">
          <div className="w-1/2">
            <HeroFileInput label="Event Image" />
          </div>
          <div className="w-1/2">
            <HeroDateRangeInput startName="start" endName="end" label="Event Date" />
          </div>
        </div>

        <div className="w-full">
          <PlaceSearch z="z-50" loc={setloc} lab="Event Location" />
        </div>

        <PrimaryLabel label="Additional Information" />
        <div className="flex w-full items-center gap-4">
          <div className="w-1/2">
            <HeroSelect
              label="Event Type"
              items={Object.entries(eventType)}
              defaultSelectedKeys={[Object.keys(eventType)[0]]}
              renderValue={(items) => {
                return items.map((item) => (
                  <div className="flex items-center gap-4" key={item.key}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                      <SVGLogo color={eventType[item.key as keyof typeof eventType]} size="80%" />
                    </div>
                    <p>{item.textValue}</p>
                  </div>
                ));
              }}
            >
              {Object.entries(eventType).map(([key, value]) => (
                <SelectItem key={key} textValue={key}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                      <SVGLogo color={value} size="80%" />
                    </div>
                    <p>{key}</p>
                  </div>
                </SelectItem>
              ))}
            </HeroSelect>
          </div>

          <div className="w-1/2">
            <HeroSelect label="Age Range" defaultSelectedKeys={[Object.keys(AgeGroup)[0]]}>
              {Object.entries(AgeGroup).map(([key, value]) => (
                <SelectItem key={key} textValue={key}>
                  {key}
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

        <PrimaryButton disabled={pending} type="submit" text="Preview Event" />
      </Form>
    </>
  );
}
