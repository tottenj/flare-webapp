'use server';
import ServerLogo from '@/components/flare/serverLogo/ServerLogo';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import ProfilePictureSkeleton from '@/components/skeletons/ProfilePictureSkeleton/ProfilePictureSkeleton';
import { signOutUser } from '@/lib/firebase/auth/signOutUser';
import { getClaims } from '@/lib/firebase/utils/getClaims';
import Link from 'next/link';
import { Suspense } from 'react';
import MainBannerMenu from './MainBannerMenu';

export default async function MainBanner() {
  const menuItems = [{ title: 'View Profile', href: '/dashboard' }];
  const { currentUser } = await getClaims();

  return (
    <div className="relative -ml-[calc((100vw-100%)/2)] flex h-[50px] w-screen items-center justify-between bg-white p-4">
      <Link href={'/'}>
        <ServerLogo size="small" />
      </Link>
      {!currentUser && (
        <div className=" hover:bg-primary text-primary flex rounded-lg border-1 p-2 font-black shadow-md transition duration-200 ease-in-out hover:text-white">
          <Link href="/signup" className="mr-2 hover:underline">
            Sign Up
          </Link>
          /
          <Link href="/signin" className="ml-2 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <MainBannerMenu>
          <Suspense fallback={<ProfilePictureSkeleton size={45} />}>
            <ProfilePicture size={45} />
          </Suspense>
        </MainBannerMenu>
      )}
    </div>
  );
}
