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
      <DateRangePicker labelPlacement="outside" defaultValue={props.defaultValue || defaultRange} />
    </>
  );
}
