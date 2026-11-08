'use server';
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';
import ProfilePictureSkeleton from '@/components/profiles/profilePicture/presentational/ProfilePictureSkeleton';
import Link from 'next/link';
import { Suspense } from 'react';
import GradientLink from '@/components/Links/GradientLink/GradientLink';
import LogoWithText from '@/components/flare/logoWithText/LogoWithText';
import MainBannerMenuContainer from '@/components/banners/mainBanner/MainBannerMenuContainer';

export default async function MainBanner() {
  return (
    <div className="flex justify-between p-4">
      <Link href={'/'}>
        <LogoWithText size="small" />
      </Link>

      <ThemeToggle />

      <div className="flex items-center justify-center gap-4">
        <GradientLink link="flare-signup" linkText="Become a Flare" />
        <Suspense fallback={<ProfilePictureSkeleton size={45} />}>
          <MainBannerMenuContainer />
        </Suspense>
      </div>
    </div>
  );
}
