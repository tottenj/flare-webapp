'use server';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import { logger } from '@/lib/logger';
import ImageService from '@/lib/services/imageService/ImageService';

export default async function ProfilePictureContainer({
  profilePicPath,
  size,
  priority
}: {
  profilePicPath: string | null;
  size: number;
  priority?: boolean
}) {
  let profilePic: string | undefined;
  if (profilePicPath) {
    try {
      profilePic = await ImageService.getDownloadUrl(profilePicPath);
    } catch (err) {
      if (err instanceof Error) logger.error(err.message);
      else logger.error("Image Service Unable To Get Download Url")
    }
  }

  return <ProfilePicture priority={priority} size={size} src={profilePic} />;
}
