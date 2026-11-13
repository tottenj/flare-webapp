import { FieldError, TextArea, TextField } from '@heroui/react';
import type { ComponentProps, ReactNode } from 'react';

import HeroDescription from '../description/HeroDescription';
import Label, { type LabelProps } from '../label/Label';

export type HeroTextAreaProps = ComponentProps<typeof TextArea> & {
  label?: string;
  labelProps?: LabelProps;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  description?: ReactNode;
};

export default function HeroTextArea({
  label,
  labelProps,
  isRequired,
  isInvalid,
  errorMessage,
  description,
  ...props
}: HeroTextAreaProps) {
  const { name, required: nativeRequired, ...textAreaProps } = props;

  return (
    <TextField
      className="flex w-full flex-col gap-1"
      name={name}
      isRequired={nativeRequired ?? isRequired}
      isInvalid={isInvalid ?? (errorMessage != null ? true : undefined)}
    >
      {(label != null || labelProps?.children != null) && (
        <Label {...labelProps}>{labelProps?.children ?? label}</Label>
      )}
      <TextArea fullWidth data-cy={`${name ?? 'textarea'}-input`} {...textAreaProps} />
      {description != null && <HeroDescription>{description}</HeroDescription>}
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
}
