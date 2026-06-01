'use client';
import SaveEventButtonPresentational from '@/components/buttons/saveEventButton/SaveEventButtonPresentational';
import { useFormAction } from '@/lib/hooks/useFormAction';
import saveEvent from '@/lib/serverActions/userActions/saveEvent/saveEvent';
import { useEffect, useRef, useState } from 'react';

export default function SaveEventButtonContainer({
  eventId,
  initialSaved = false,
}: {
  eventId: string;
  initialSaved?: boolean;
}) {
  const [filled, setFilled] = useState(initialSaved);
  const rollbackFilledRef = useRef<boolean | null>(null);

  const { action, pending } = useFormAction(saveEvent, {
    toast: {
      success: filled ? 'Removed from Saved Events' : 'Saved Event',
      loading: filled ? 'Removing from Saved Events' : 'Saving Event',
      error: 'Error Saving Event',
    },
    onError: () => {
      if (rollbackFilledRef.current !== null) {
        setFilled(rollbackFilledRef.current);
      }
      rollbackFilledRef.current = null;
    },
    onSuccess: () => {
      rollbackFilledRef.current = null;
    },
  });

  useEffect(() => {
    setFilled(initialSaved);
  }, [initialSaved]);

  const onClick = async () => {
    if (pending) return;
    const previousFilled = filled;
    const nextFilled = !filled;
    rollbackFilledRef.current = previousFilled;
    setFilled(nextFilled);
    await action({ eventId, save: nextFilled });
  };

  return (
    <SaveEventButtonPresentational disabled={pending} filled={filled} onClickAction={onClick} />
  );
}
