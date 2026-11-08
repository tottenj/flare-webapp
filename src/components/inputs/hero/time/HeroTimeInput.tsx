import type { InputHTMLAttributes } from 'react';

interface HeroTimeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function HeroTimeInput({ name, label, ...props }: HeroTimeInputProps) {
  return (
    <label className="flex flex-col gap-1">
      {label && <span>{label}</span>}
      <input
        type="time"
        name={name ?? 'time'}
        {...props}
        className={`min-h-11 rounded-xl border border-neutral-300 bg-white px-3 py-2 ${props.className ?? ''}`}
      />
    </label>
  );
}
