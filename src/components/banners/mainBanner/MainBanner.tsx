'use server';
import ServerLogo from '@/components/flare/serverLogo/ServerLogo';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import ProfilePictureSkeleton from '@/components/skeletons/ProfilePictureSkeleton/ProfilePictureSkeleton';
import { signOutUser } from '@/lib/firebase/auth/signOutUser';
import { getClaims } from '@/lib/firebase/utils/getClaims';
import Link from 'next/link';
import { Suspense } from 'react';
import MainBannerMenu from './MainBannerMenu';
import PrimaryLink from '@/components/Links/PrimaryLink/PrimaryLink';
import GradientLink from '@/components/Links/GradientLink/GradientLink';

export default async function MainBanner() {
  const { currentUser } = await getClaims();
  let src: string | undefined = '/defaultProfile.svg';
  if (currentUser) src = undefined;

  return (
    <div className="relative -ml-[calc((100vw-100%)/2)] flex h-[50px] w-screen items-center justify-between bg-white p-4">
      <Link href={'/'}>
        <ServerLogo size="small" />
      </Link>

      <div className="flex items-center justify-center gap-4">
        {!currentUser && <GradientLink link="" linkText="Become a Flare" />}
        <MainBannerMenu>
          <Suspense fallback={<ProfilePictureSkeleton size={45} />}>
            <ProfilePicture src={src} size={45} />
          </Suspense>
        </MainBannerMenu>
      </div>
    </div>
  );
}
