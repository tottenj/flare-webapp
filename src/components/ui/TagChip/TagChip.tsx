'use client';
import { tagClasses } from '@/lib/types/TagColour';
import { getTagColor } from '@/lib/utils/ui/getTagColour';
import type { HTMLAttributes } from 'react';

interface TagChipProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  onClose?: () => void;
  variant?: string;
}

export default function TagChip({ label, onClose, ...props }: TagChipProps) {
  return (
    <span
      {...props}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 capitalize ${tagClasses(getTagColor(label))} ${props.className ?? ''}`}
    >
      {label}
      {onClose && (
        <button type="button" aria-label={`Remove ${label}`} onClick={onClose}>
          ×
        </button>
      )}
    </span>
  );
}
