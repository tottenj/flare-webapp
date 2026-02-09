import { TimeInput, TimeInputProps } from "@heroui/react";

interface heroTimeInput extends TimeInputProps{}
export default function HeroTimeInput({name, ...props}: heroTimeInput) {
  return (
    <TimeInput name={name ?? 'time'} classNames={{inputWrapper:"rounded-2xl"}} {...props}/>
  )
}