import type { InputHTMLAttributes } from 'react';

interface HeroDateRangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export default function HeroDateRangeInput({ label, ...props }: HeroDateRangeProps) {
  return (
    <label className="flex flex-col gap-1">
      {label && <span>{label}</span>}
      <input
        type="date"
        {...props}
        className={`min-h-11 rounded-xl border border-neutral-300 bg-white px-3 py-2 ${props.className ?? ''}`}
      />
    </label>
  );
}
