'use client';

import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import BasicSelect from '@/components/inputs/basicSelect/BasicSelect';
import ColourSelect from '@/components/inputs/colourSelect/ColourSelect';
import DateTime from '@/components/inputs/dateTime/DateTime';
import FileInput from '@/components/inputs/file/FileInput';
import PrimaryLabel from '@/components/inputs/labels/primaryLabel/PrimaryLabel';
import NumberInput from '@/components/inputs/numberInput/NumberInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import TextArea from '@/components/inputs/textArea/TextArea';
import TextInput from '@/components/inputs/textInput/TextInput';
import Event from '@/lib/classes/event/Event';
import { ageGroupOptions } from '@/lib/enums/AgeGroup';
import { colourOptions } from '@/lib/enums/eventType';
import { storage } from '@/lib/firebase/auth/configs/clientApp';
import addEvent from '@/lib/formActions/addEvent/addEvent';
import { useActionToast } from '@/lib/hooks/useActionToast/useActionToast';
import useFileChange from '@/lib/hooks/useFileChange/useFileChange';
import flareLocation from '@/lib/types/Location';
import React, { SetStateAction, useActionState, useEffect, useState } from 'react';

interface addEventFormProps {
  setClose: React.Dispatch<SetStateAction<boolean>>;
}
export default function AddEventForm({ setClose }: addEventFormProps) {
  const initialState = { message: '', eventId: null };
  const [state, action, pending] = useActionState(addEvent, initialState);
  const { validFiles, handleFileChange } = useFileChange();
  const [loc, setloc] = useState<flareLocation | null>(null);
  useActionToast(state, pending);

  useEffect(() => {
    if (state.message === 'success' && !pending && state.eventId) {
      (async () => {
        if (!state.eventId) return;
        await Event.uploadImages(
          state.eventId,
          storage,
          validFiles.map((file) => file.file)
        );
        setClose(false);
      })();
    }
  }, [state, pending]);

  return (
    <>
      <h1 className="text-center">Add Event</h1>
      <form className="relative z-50 mt-4 flex flex-col overflow-visible" action={action.bind(loc)}>
        <TextInput label="Event Title" name="title" />
        <TextArea label="Event Description" name="description" />
        <PrimaryLabel label="Event Image" />
        <FileInput
          name="eventImage"
          onChange={(file) => handleFileChange('eventImage', file)}
          buttonText="Upload File"
        />
        <br></br>
        <div className="mb-4 flex justify-between">
          <DateTime label="Event Start" name="start" />
          <DateTime label="Event End" name="end" />
        </div>
        <PlaceSearch z='z-50' loc={setloc} lab="Event Location" />
        {loc && <input type="hidden" name="location" required={true} value={JSON.stringify(loc)} />}
        <br></br>
        <ColourSelect z={"z-40"} label="Event Type" options={colourOptions} name="type" />
        <br></br>
        <BasicSelect z={"z-30"} label="Age Range" options={ageGroupOptions} name="age" />
        <NumberInput defaultVal={0} label="Price (Leave 0 for Free / N/A)" name="price" />
        <TextInput
          type="url"
          label="Link To Tickets (Leave Blank if N/A)"
          name="tickets"
          reqired={false}
        />
        ;
        <PrimaryButton type="submit" />
      </form>
    </>
  );
}
