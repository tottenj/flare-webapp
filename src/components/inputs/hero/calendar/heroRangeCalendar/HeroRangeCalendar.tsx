import type { InputHTMLAttributes } from 'react';

interface HeroRangeCalendarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export default function HeroRangeCalendar(props: HeroRangeCalendarProps) {
  return (
    <input
      type="date"
      {...props}
      className={`rounded-xl border border-neutral-300 bg-white px-3 py-2 ${props.className ?? ''}`}
    />
  );
}
