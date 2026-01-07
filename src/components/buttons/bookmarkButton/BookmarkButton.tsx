'use client';
import addBookmark from '@/lib/formActions/addBookmark/addBookmark';
import { useActionToast } from '@/lib/hooks/useActionToast/useActionToast';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, startTransition, useActionState, useOptimistic, useState } from 'react';
import useUnifiedUser from '@/lib/hooks/useUnifiedUser';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modals/mainModal/MainModal';
import Logo from '@/components/flare/logo/Logo';
import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import LogoWithText from '@/components/flare/logoWithText/LogoWithText';
import { small } from '../primaryButton/PrimaryButton.stories';
import ServerLogo from '#src/components/flare/serverLogo/LogoWithText.js';
import PrimaryButton from '../primaryButton/PrimaryButton';
import Link from 'next/link';
import Image from 'next/image';
import CtaModal from '@/components/modals/ctaModal/CtaModal';

interface bookmarkButtonProps {
  event: string;
  seen: boolean;
}
export default function BookmarkButton({ event, seen = false }: bookmarkButtonProps) {
  const [state, action, pending] = useActionState(addBookmark, { message: '' });
  const [optimisticSeen, setOptimisticSeen] = useOptimistic(seen);
  const sucMessage = seen ? 'Saved Event' : 'Removed Event';
  const { user } = useUnifiedUser();
  const [open, setOpen] = useState(false);

  useActionToast(state, pending, { successMessage: sucMessage, loadingMessage: 'Loading' });

  const handleSubmit = (e: FormEvent) => {
    if (!user) {
      e.preventDefault();
      setOpen(true);
    } else {
      startTransition(() => {
        setOptimisticSeen(!optimisticSeen);
      });
    }
  };

  return (
    <form
      className="absolute top-4 left-4 md:top-2 lg:left-2"
      action={!user ? undefined : action}
      onSubmit={(e) => handleSubmit(e)}
    >
      <button type="submit">
        <FontAwesomeIcon
          icon={optimisticSeen ? solidBookmark : regularBookmark}
          className="text-2xl"
        />
        <CtaModal />
        <input type="hidden" value={event} name="eventId" />
        <input type="hidden" value={String(seen)} name="seen" />
      </button>
    </form>
  );
}
