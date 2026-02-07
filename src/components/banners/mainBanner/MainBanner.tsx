'use server';
import ProfilePictureSkeleton from '@/components/skeletons/ProfilePictureSkeleton/ProfilePictureSkeleton';
import Link from 'next/link';
import { Suspense } from 'react';
import MainBannerMenu from './MainBannerMenu';
import GradientLink from '@/components/Links/GradientLink/GradientLink';
import LogoWithText from '@/components/flare/logoWithText/LogoWithText';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import ProfilePictureContainer from '@/components/profiles/profilePicture/ProfilePictureContainer';
import MainBannerMenuContainer from '@/components/banners/mainBanner/MainBannerMenuContainer';

export default async function MainBanner() {
  return (
    <div className="flex justify-between p-4">
      <Link href={'/'}>
        <LogoWithText size="small" />
      </Link>

      <div className="flex items-center justify-center gap-4">
        <GradientLink link="flare-signup" linkText="Become a Flare" />
        <Suspense fallback={<ProfilePictureSkeleton size={45} />}>
          <MainBannerMenuContainer />
        </Suspense>
      </div>
    </div>
  );
}
