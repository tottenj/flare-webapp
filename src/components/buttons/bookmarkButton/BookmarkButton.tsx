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
import ServerLogo from '@/components/flare/serverLogo/ServerLogo';
import PrimaryButton from '../primaryButton/PrimaryButton';
import Link from 'next/link';
import Image from 'next/image';

interface bookmarkButtonProps {
  event: string;
  seen: boolean;
  slug: string;
}
export default function BookmarkButton({ event, seen = false, slug }: bookmarkButtonProps) {
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
    <form action={!user ? undefined : action} onSubmit={(e) => handleSubmit(e)}>
      <button type="submit">
        <FontAwesomeIcon
          icon={optimisticSeen ? solidBookmark : regularBookmark}
          className="text-2xl"
        />
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <div className="mr-auto ml-auto flex w-3/4 flex-col items-center">
            <h1 className="mt-4 mb-8 text-center">Become A Member!</h1>
            <div className="absolute left-4">
              <ServerLogo size="small" />
            </div>

            <div className="relative w-full h-[400px] mb-4">
              <Image alt="Pride Heart" src={'/prideHeart.png'} fill className='object-cover rounded-2xl' />
            </div>
            <p className="text-center">
              You need to be a member to save events — so you never lose track of something that
              sparks your interest. Flare connects you to bold, inclusive queer events happening in
              your area and beyond. Joining is free and gives you access to features made just for
              our community — like saving events to revisit later, getting helpful updates, and
              discovering spaces where you truly belong. Be part of a platform built to celebrate
              and support queer joy, visibility, and connection.
            </p>
            <Link
              href={'/signup'}
              className="bg-primary border-primary hover:text-primary mt-8 w-full rounded-2xl border-2 p-2 text-center font-black text-white ease-in-out hover:bg-white"
            >
              Sign Up Now!
            </Link>
          </div>
        </Modal>
        <input type="hidden" value={event} name="eventId" />
        <input type="hidden" value={String(seen)} name="seen" />
      </button>
    </form>
  );
}
