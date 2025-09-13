import { DateRangePicker, DateRangePickerProps, DateValue, RangeValue } from '@heroui/react';
import { CalendarDateTime, now, parseZonedDateTime, ZonedDateTime } from '@internationalized/date';

interface HeroDateRangeProps extends DateRangePickerProps {}
export default function HeroDateRangeInput(props: HeroDateRangeProps) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today: ZonedDateTime = now(timeZone);
  const defaultRange = {
    start: today,
    end: today,
  };

  return (
    <>
      {/*@ts-ignore */}
      <DateRangePicker labelPlacement={props.labelPlacement || "inside"} defaultValue={props.defaultValue || defaultRange}
        classNames={{
          inputWrapper:
            ' focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-0 focus-within:outline-none',
          input: 'outline-none focus:outline-none',
          popoverContent: "rounded-none",
       
          calendar: "rounded-none"
        }}
        radius={props.radius || "sm"}
        hideTimeZone={props.hideTimeZone ?? true}
        {...props}
      />
    </>
  );
}
