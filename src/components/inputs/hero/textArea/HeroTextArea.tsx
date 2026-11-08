import type { TextareaHTMLAttributes } from 'react';

interface HeroAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}

export default function HeroTextArea({
  label,
  isRequired,
  isInvalid,
  errorMessage,
  ...props
}: HeroAreaProps) {
  return (
    <label className="flex w-full flex-col gap-1">
      {label && <span>{label}</span>}
      <textarea
        data-cy={`${props.name ?? 'textarea'}-input`}
        aria-invalid={isInvalid || undefined}
        required={props.required ?? isRequired}
        {...props}
        className={`min-h-28 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-pink-600 ${props.className ?? ''}`}
      />
      {errorMessage && <span className="text-sm text-red-700">{errorMessage}</span>}
    </label>
  );
}
