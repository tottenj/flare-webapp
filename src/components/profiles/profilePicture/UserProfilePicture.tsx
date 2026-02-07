'use server';

import ProfilePictureContainer from '@/components/profiles/profilePicture/ProfilePictureContainer';
import { UserContextService } from '@/lib/services/userContextService/userContextService';

export default async function UserProfilePicture({size}: {size:number}) {
  const ctx = await UserContextService.requireNone();
  const profilePic = ctx?.user.profilePic ?? null;


  return <ProfilePictureContainer priority profilePicPath={profilePic} size={size} />;
}
