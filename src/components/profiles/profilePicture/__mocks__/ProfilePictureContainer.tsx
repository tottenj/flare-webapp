import ProfilePicture from '@/components/profiles/profilePicture/presentational/ProfilePicture';

export default function ProfilePictureContainer({
  profilePicPath,
  size,
  priority,
}: {
  profilePicPath: string | null;
  size: number;
  priority?: boolean;
}) {
  return <ProfilePicture size={size} src={profilePicPath ?? undefined} priority={priority} />;
}
