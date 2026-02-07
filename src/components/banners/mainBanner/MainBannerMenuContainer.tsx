'use server';

import MainBannerMenu from '@/components/banners/mainBanner/MainBannerMenu';
import ProfilePictureContainer from '@/components/profiles/profilePicture/ProfilePictureContainer';
import { UserContextService } from '@/lib/services/userContextService/userContextService';

export default async function MainBannerMenuContainer() {
  const ctx = await UserContextService.requireNone();

  return (
    <MainBannerMenu isSignedIn={ctx?.user ? true : false}>
      <ProfilePictureContainer size={45} profilePicPath={ctx?.user.profilePic ?? null} priority />
    </MainBannerMenu>
  );
}
