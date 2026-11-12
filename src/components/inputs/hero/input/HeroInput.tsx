import { FieldError, Input, TextField } from '@heroui/react';
import type { ComponentProps, ReactNode } from 'react';

import Label, { type LabelProps } from '../label/Label';
import HeroDescription from '../description/HeroDescription';

export type HeroInputProps = ComponentProps<typeof Input> & {
  label?: string;
  labelProps?: LabelProps;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  description?: ReactNode;
};

export default function HeroInput({
  label,
  labelProps,
  isRequired,
  isInvalid,
  errorMessage,
  description,
  ...props
}: HeroInputProps) {
  const { name, type, required: nativeRequired, ...inputProps } = props;
  const required = nativeRequired ?? isRequired;

  return (
    <TextField
      className="flex w-full flex-col gap-1"
      name={name}
      type={type}
      isRequired={required}
      isInvalid={isInvalid ?? (errorMessage != null ? true : undefined)}
    >
      <Label {...labelProps}>{labelProps?.children ?? label}</Label>
      <Input fullWidth data-cy={`${name ?? 'input'}-input`} {...inputProps} />
      {description != null && <HeroDescription>{description}</HeroDescription>}
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
}
