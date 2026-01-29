'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import TagAutoCompleteContainer from '@/components/inputs/autocomplete/tagAutocomplete/TagAutoCompleteContainer';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { Form } from '@heroui/react';
import { useState } from 'react';

export default function EventFormPresentational() {
  const [location, setLocation] = useState<LocationInput | null>(null);

  return (
    <Form className="flex flex-col items-center p-4">
      <HeroInput label="Event Name" name="eventName" placeholder="Enter event name" required />
      <HeroTextArea
        label="Event Description"
        name="eventDescription"
        placeholder="Enter event description"
        required
      />
      <PlaceSearch label="Event Location" onChange={setLocation} required />
      <TagAutoCompleteContainer />
      <PrimaryButton type="submit" />
    </Form>
  );
}
