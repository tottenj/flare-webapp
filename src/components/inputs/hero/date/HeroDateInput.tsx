import { DatePicker, DatePickerProps } from '@heroui/date-picker';
import { getLocalTimeZone, now } from '@internationalized/date';

interface heroDateInputProps extends DatePickerProps {
  withTime?: boolean;
}

export default function HeroDateInput({ withTime, name, ...props }: heroDateInputProps) {
  const defVal = withTime ? now(getLocalTimeZone()) : null;

  return (
      <DatePicker
        name={name ?? 'date'}
        defaultValue={defVal}
        className="rounded-none"
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
