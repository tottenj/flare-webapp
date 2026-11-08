import { getLocalTimeZone, now, parseAbsoluteToLocal } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import type { ChangeEventHandler, InputHTMLAttributes } from 'react';
import { useState } from 'react';

interface HeroDateInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> {
  label?: string;
  withTime?: boolean;
  error?: string;
  isRequired?: boolean;
  defaultValue?: DateValue | string | null;
  value?: DateValue | string | null;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function HeroDateInput({
  withTime,
  label,
  name,
  error,
  defaultValue,
  value,
  isRequired,
  onChange,
  ...props
}: HeroDateInputProps) {
  const resolvedDefault = defaultValue ?? (withTime ? now(getLocalTimeZone()) : null);
  const toInputValue = (date: DateValue | string | null | undefined) => {
    if (!date) return undefined;
    return (typeof date === 'string' ? date : date.toString()).slice(0, withTime ? 16 : 10);
  };
  const [uncontrolledValue, setUncontrolledValue] = useState(
    toInputValue(value ?? resolvedDefault) ?? ''
  );
  const inputValue = value === undefined ? uncontrolledValue : (toInputValue(value) ?? '');
  const dateTimeValue = withTime ? inputValue : `${inputValue}T12:00`;
  const zonedValue = inputValue
    ? parseAbsoluteToLocal(new Date(dateTimeValue).toISOString()).toString()
    : '';

  return (
    <label className="flex w-full flex-col gap-1">
      {label && <span>{label}</span>}
      <input
        type={withTime ? 'datetime-local' : 'date'}
        data-cy={`${name ?? 'date'}-input`}
        required={props.required ?? isRequired}
        aria-invalid={Boolean(error) || undefined}
        value={inputValue}
        onChange={(event) => {
          if (value === undefined) setUncontrolledValue(event.currentTarget.value);
          onChange?.(event);
        }}
        {...props}
        className={`min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 ${props.className ?? ''}`}
      />
      <input type="hidden" name={name ?? 'date'} value={zonedValue} />
      {error && <span className="text-sm text-red-700">{error}</span>}
    </label>
  );
}
