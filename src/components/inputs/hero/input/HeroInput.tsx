import type { InputHTMLAttributes } from 'react';

export interface HeroInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}

export default function HeroInput({
  label,
  isRequired,
  isInvalid,
  errorMessage,
  ...props
}: HeroInputProps) {
  const required = props.required ?? isRequired;
  return (
    <label className="flex w-full flex-col gap-1">
      {label && <span>{label}</span>}
      <input
        data-cy={`${props.name ?? 'input'}-input`}
        aria-invalid={isInvalid || undefined}
        required={required}
        {...props}
        className={`min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-pink-600 ${props.className ?? ''}`}
      />
      {errorMessage && <span className="text-sm text-red-700">{errorMessage}</span>}
    </label>
  );
}
