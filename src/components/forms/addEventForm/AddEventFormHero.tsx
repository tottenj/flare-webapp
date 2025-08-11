"use client"
import { Input } from '@heroui/input';
import { Form } from '@heroui/form';
import useCustomUseForm from '@/lib/hooks/useForm/useCustomUseForm';
import addEvent from '@/lib/formActions/addEvent/addEvent';
export default function AddEventFormHero({close}: {close?: () => void}) {
  const {action, state, pending} = useCustomUseForm(addEvent, "Success", undefined, close)


  return (
    <Form action={action}>
      <Input
        variant="flat"
        radius="md"
        labelPlacement="outside-top"
        label="Blah"
        isRequired
      />
    </Form>
  );
}
