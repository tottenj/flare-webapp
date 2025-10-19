'use server';

import ServerLogo from '@/components/flare/serverLogo/ServerLogo';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import ProfilePictureSkeleton from '@/components/skeletons/ProfilePictureSkeleton/ProfilePictureSkeleton';
import { getClaims } from '@/lib/firebase/utils/getClaims';
import Link from 'next/link';
import { Suspense } from 'react';
import MainBannerMenu from './MainBannerMenu';
import GradientLink from '@/components/Links/GradientLink/GradientLink';

export default async function MainBanner() {
  //const res = await getClaims();
  let src: string | undefined = '/defaultProfile.svg';
  //if (res?.uid) src = undefined;

  const res = {uid: "klsdj"}
  return (
    <div className="relative -ml-[calc((100vw-100%)/2)] flex h-[50px] w-screen items-center justify-between bg-white p-4">
      <Link href={'/'}>
        <ServerLogo size="small" />
      </Link>

      <div className="flex items-center justify-center gap-4">
        {!res?.uid && <GradientLink link="flare-signup" linkText="Become a Flare" />}
        <MainBannerMenu>
          <Suspense fallback={<ProfilePictureSkeleton size={45} />}>
            <ProfilePicture src={src} size={45} />
          </Suspense>
        </MainBannerMenu>
      </div>
    </div>
  );
}
