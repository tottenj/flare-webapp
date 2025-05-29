'use server';
import ServerLogo from '@/components/flare/serverLogo/ServerLogo';
import GeneralLoader from '@/components/loading/GeneralLoader';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import { signOutUser } from '@/lib/firebase/auth/signOutUser';
import { getClaims } from '@/lib/firebase/utils/getClaims';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function MainBanner() {
  const menuItems = [{ title: 'View Profile', href: '/dashboard' }];
  const { currentUser } = await getClaims();

  return (
    <div className="relative -ml-[calc((100vw-100%)/2)] flex w-screen items-center justify-between bg-white/80 p-4">
      <Link href={'/'}>
        <ServerLogo size="medium" />
      </Link>
      {!currentUser && (
        <div className="border-primary flex rounded-lg border-1 p-2">
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
        <div className="group relative flex flex-col items-end">
          <div className="z-10 cursor-pointer">
            <Suspense fallback={<GeneralLoader/>}>
            <ProfilePicture size={65} />
            </Suspense>
          </div>

          <div className="absolute top-full right-0 z-20 hidden w-40 flex-col rounded-md bg-white shadow-lg ring-1 ring-black/5 group-hover:flex">
            <ul className="py-1 text-sm text-gray-700">
              {menuItems.map(({ title, href }) => (
                <li key={title} className="w-full cursor-pointer px-4 py-2 hover:bg-gray-100">
                  <Link href={href}>{title}</Link>
                </li>
              ))}
              <li className="w-full cursor-pointer px-4 py-2 hover:bg-gray-100">
                <form action={signOutUser}>
                  <button type="submit">Sign Out</button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
