import { Textarea, TextAreaProps } from "@heroui/react";

interface HeroAreaProps extends TextAreaProps {}

export default function HeroTextArea(props: HeroAreaProps) {
  return (
    <Textarea isClearable={props.isClearable || true} variant={props.variant || "flat"} />
  )
}