import type { InputHTMLAttributes } from 'react';

interface HeroNumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  minValue?: number;
  maxValue?: number;
}

export default function HeroNumberInput({
  label,
  description,
  minValue,
  maxValue,
  ...props
}: HeroNumberInputProps) {
  return (
    <label className="flex w-full flex-col gap-1">
      {label && <span>{label}</span>}
      <input
        type="number"
        min={minValue}
        max={maxValue}
        data-cy={`${props.name ?? 'price'}-input`}
        {...props}
        className={`min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 ${props.className ?? ''}`}
      />
      {description && <span className="text-sm text-neutral-600">{description}</span>}
    </label>
  );
}
