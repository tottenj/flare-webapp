import { Textarea, TextAreaProps } from '@heroui/react';

interface HeroAreaProps extends TextAreaProps {}

export default function HeroTextArea(props: HeroAreaProps) {
  return (
    <Textarea
      isClearable={props.isClearable || true}
      variant={props.variant || 'flat'}
      classNames={{
        inputWrapper:
          'rounded-2xl focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-0 focus-within:outline-none',
        input: 'outline-none focus:outline-none',
      }}
      labelPlacement={props.labelPlacement || "inside"}
      {...props}
    />
  );
}
