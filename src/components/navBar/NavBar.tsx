import FlareLogo from '@/components/flare/configurableLogo/ConfigurableLogo';
import ProfilePictureSkeleton from '@/components/profiles/profilePicture/presentational/ProfilePictureSkeleton';
import NavBarAvatar from '@/components/navBar/NavBarAvatar';
import Link from 'next/link';
import { Suspense } from 'react';

export default function NavBar() {
  return (
    <nav
      aria-label="Main navigation"
      className="relative mb-8 flex h-20 items-center justify-center border-b-2"
    >
      <Link href="/events" className="absolute left-4">
        <FlareLogo />
      </Link>
      <div className="font-heading flex gap-8 font-bold">
        <Link className="hover:text-accent transition-all ease-in-out duration-300" href="/">
          Explore
        </Link>
        <Link className="hover:text-accent transition-all ease-in-out duration-300" href="/">Organizations</Link>
      </div>
      <div className="absolute right-4">
        <Suspense fallback={<ProfilePictureSkeleton size={40} />}>
          <NavBarAvatar />
        </Suspense>
      </div>
    </nav>
  );
}
