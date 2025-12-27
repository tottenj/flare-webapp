'use client';
import ServerLogo from '#src/components/flare/serverLogo/LogoWithText.js';
import PassInModal from '../passInModal/PassInModal';
import Link from 'next/link';
import Image from 'next/image';

export default function CtaModal() {
  return (
    <PassInModal>
      <div className="mr-auto ml-auto flex w-3/4 flex-col items-center">
        <h1 className="mt-4 mb-8 text-center">Become A Member!</h1>
        <div className="absolute left-4">
          <ServerLogo size="small" />
        </div>

        <div className="relative mb-4 h-[400px] w-full">
          <Image
            alt="Pride Heart"
            src={'/prideHeart.png'}
            fill
            className="rounded-2xl object-cover"
          />
        </div>
        <p className="text-center">
          You need to be a member to save events — so you never lose track of something that sparks
          your interest. Flare connects you to bold, inclusive queer events happening in your area
          and beyond. Joining is free and gives you access to features made just for our community —
          like saving events to revisit later, getting helpful updates, and discovering spaces where
          you truly belong. Be part of a platform built to celebrate and support queer joy,
          visibility, and connection.
        </p>
        <Link
          href={'/signup'}
          className="bg-primary border-primary hover:text-primary mt-8 w-full rounded-2xl border-2 p-2 text-center font-black text-white ease-in-out hover:bg-white"
        >
          Sign Up Now!
        </Link>
      </div>
    </PassInModal>
  );
}
