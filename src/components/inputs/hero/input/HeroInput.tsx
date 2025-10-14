import { Input, InputProps } from '@heroui/react';

export interface HeroInputProps extends InputProps {}

export default function HeroInput(props: HeroInputProps) {
  return (
    <Input
      variant={props.variant || 'flat'}
      radius={props.radius || 'md'}
      labelPlacement={props.labelPlacement || 'inside'}
      data-cy={`${props.name}-input`}
      classNames={{
        label: "justify-self: start",
        inputWrapper:'rounded-2xl focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-0 focus-within:outline-none',
        input: 'outline-none focus:outline-none', // kill native blue outline
      }}
      {...props}
    />
  );
}
