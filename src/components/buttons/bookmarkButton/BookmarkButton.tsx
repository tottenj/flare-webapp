'use client';
import addBookmark from '@/lib/formActions/addBookmark/addBookmark';
import { useActionToast } from '@/lib/hooks/useActionToast/useActionToast';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { startTransition, useActionState, useOptimistic } from 'react';

interface bookmarkButtonProps {
  event: string;
  seen: boolean;
}
export default function BookmarkButton({ event, seen = false }: bookmarkButtonProps) {
  const [state, action, pending] = useActionState(addBookmark, { message: '' });
  const [optimisticSeen, setOptimisticSeen] = useOptimistic(seen);
  const sucMessage = seen ? 'Saved Event' : 'Removed Event';

  useActionToast(state, pending, { successMessage: sucMessage, loadingMessage: 'Loading' });

  const handleSubmit = () => {
    startTransition(() => {
      setOptimisticSeen(!optimisticSeen);
    });
  };

  return (
    <form action={action} onSubmit={handleSubmit}>
      <button type="submit">
        <FontAwesomeIcon
          icon={optimisticSeen ? solidBookmark : regularBookmark}
          className="text-2xl"
        />
        <input type="hidden" value={event} name="eventId" />
        <input type="hidden" value={String(seen)} name="seen" />
      </button>
    </form>
  );
}
