import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import ImageService from '@/lib/services/imageService/ImageService';

export default async function ProfilePictureContainer({
  profilePicPath,
  size,
}: {
  profilePicPath?: string;
  size: number;
}) {
  let profilePic = undefined;
  if (profilePicPath) {
    profilePic = await ImageService.getDownloadUrl(profilePicPath);
  }

  return <ProfilePicture size={size} src={profilePic} />;
}
