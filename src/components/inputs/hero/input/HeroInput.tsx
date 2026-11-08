import { Input } from '@heroui/react';
import type { ComponentProps } from 'react';

import Label, { type LabelProps } from '../label/Label';

export type HeroInputProps = ComponentProps<typeof Input> & {
  label?: string;
  labelProps?: LabelProps;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
};

export default function HeroInput({
  label,
  labelProps,
  isRequired,
  isInvalid,
  errorMessage,
  ...props
}: HeroInputProps) {
  const required = props.required ?? isRequired;
  return (
    <div className="flex w-full flex-col gap-1">
      <Label
        {...labelProps}
        className={`flex w-full flex-col gap-1 ${labelProps?.className ?? ''}`}
      >
        {labelProps?.children ?? label}
        <Input
          fullWidth
          data-cy={`${props.name ?? 'input'}-input`}
          aria-invalid={isInvalid || undefined}
          required={required}
          {...props}
        />
      </Label>
      {errorMessage && <span className="text-sm text-red-700">{errorMessage}</span>}
    </div>
  );
}
