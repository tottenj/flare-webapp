"use client"
import PrimaryButton from "@/components/buttons/primaryButton/PrimaryButton";
import HeroInput from "@/components/inputs/hero/input/HeroInput";
import HeroTextArea from "@/components/inputs/hero/textArea/HeroTextArea";
import { Form } from "@heroui/react";

export default function EventFormPresentational() {
  return (
    <Form className="flex flex-col items-center p-4">
        <HeroInput label="Event Name" name="eventName" placeholder="Enter event name" required />
        <HeroTextArea label="Event Description" name="eventDescription" placeholder="Enter event description" required />

        <PrimaryButton type="submit"/>
    </Form>
  )
}