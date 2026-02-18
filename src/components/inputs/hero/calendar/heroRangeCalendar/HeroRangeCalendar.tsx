import { RangeCalendar, RangeCalendarProps } from '@heroui/react';

interface heroRangeCalendar extends RangeCalendarProps {}

export default function HeroRangeCalendar({ ...props }: heroRangeCalendar) {
  return <RangeCalendar className='bg-default-50'  classNames={{base: "rounded-2xl", pickerWrapper:"bg-red-50"}} {...props} />;
}
