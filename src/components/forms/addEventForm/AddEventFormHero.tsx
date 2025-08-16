'use client';
import { Form } from '@heroui/form';
import useCustomUseForm from '@/lib/hooks/useForm/useCustomUseForm';
import addEvent from '@/lib/formActions/addEvent/addEvent';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import { DateRangePicker} from '@heroui/react';
import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import HeroDateRangeInput from '@/components/inputs/hero/dateRange/HeroDateRangeInput';

export default function AddEventFormHero({ close }: { close?: () => void }) {
  const { action, state, pending } = useCustomUseForm(addEvent, 'Success', undefined, close);


  return (
    <Form action={action} validationErrors={state.errors}>
      <HeroInput label="Event Title" name='title' isRequired />
      <HeroTextArea label="Event Description" name='description' />
      <HeroDateRangeInput startName='start' endName='end' label="Event Date" />
      


      <PrimaryButton disabled={pending} type='submit' text="Preview Event" />
    </Form>
  );
}
