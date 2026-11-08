import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface HeroChipProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  variant?: string;
  color?: string;
  onClose?: () => void;
}

export default function HeroChip({ className, children, onClose, ...props }: HeroChipProps) {
  return (
    <span
      {...props}
      className={clsx(
        'inline-flex items-center rounded-full border border-neutral-300 px-3 py-1 text-sm',
        className
      )}
    >
      {children}
      {onClose && (
        <button type="button" aria-label="Remove filter" onClick={onClose}>
          ×
        </button>
      )}
    </span>
  );
}
