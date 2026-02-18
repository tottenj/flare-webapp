import { DatePicker, DatePickerProps } from '@heroui/date-picker';
import { getLocalTimeZone, now } from '@internationalized/date';

interface heroDateInputProps extends DatePickerProps {
  withTime?: boolean;
  error?: string;
}

export default function HeroDateInput({ withTime, name, error, ...props }: heroDateInputProps) {
  const defVal = withTime ? now(getLocalTimeZone()) : null;

  return (
    <DatePicker
      name={name ?? 'date'}
      data-cy={`${name ?? 'date'}-input`}
      defaultValue={defVal}
      className="rounded-none"
      isInvalid={!!error}
      errorMessage={error}
      classNames={{
        calendar: 'rounded-none',
        calendarContent: 'rounded-none',
        popoverContent: 'rounded-2xl',
        base: 'rounded-none',
        inputWrapper: 'rounded-2xl',
      }}
      {...props}
    />
  );
}
