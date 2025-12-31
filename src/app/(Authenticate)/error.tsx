// app/confirmation/error.tsx
'use client';

export default function Error({ error }: { error: Error }) {
  console.error('CONFIRMATION ERROR:', error);
  return <pre data-cy="confirmation-error">{error.message}</pre>;
}
