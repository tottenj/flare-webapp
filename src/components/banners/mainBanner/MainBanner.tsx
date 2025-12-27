'use server';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import ProfilePictureSkeleton from '@/components/skeletons/ProfilePictureSkeleton/ProfilePictureSkeleton';

import Link from 'next/link';
import { Suspense } from 'react';
import MainBannerMenu from './MainBannerMenu';
import GradientLink from '@/components/Links/GradientLink/GradientLink';
import LogoWithText from '@/components/flare/logoWithText/LogoWithText';

export default async function MainBanner() {
  let src: string | undefined = '/defaultProfile.svg';
  return (
    <div className="flex justify-between p-4">
      <Link href={'/'}>
        <LogoWithText size="small" />
      </Link>

      <div className="flex items-center justify-center gap-4">
        <GradientLink link="flare-signup" linkText="Become a Flare" />
        <MainBannerMenu>
          <Suspense fallback={<ProfilePictureSkeleton size={45} />}>
            <ProfilePicture src={src} size={45} />
          </Suspense>
        </MainBannerMenu>
      </div>
    </div>
  );
}
