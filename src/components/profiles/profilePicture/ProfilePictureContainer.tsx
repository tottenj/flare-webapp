'use server';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import ImageService from '@/lib/services/imageService/ImageService';

export default async function ProfilePictureContainer({
  profilePicPath,
  size,
}: {
  profilePicPath: string | null;
  size: number;
}) {
  let profilePic: string | undefined;

  if (profilePicPath) {
    try {
      profilePic = await ImageService.getDownloadUrl(profilePicPath);
    } catch (err) {}
  }

  return <ProfilePicture size={size} src={profilePic} />;
}
