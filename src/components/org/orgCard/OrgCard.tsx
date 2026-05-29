import ProfilePictureSkeleton from '@/components/profiles/profilePicture/presentational/ProfilePictureSkeleton';
import ProfilePictureContainer from '@/components/profiles/profilePicture/ProfilePictureContainer';
import Link from 'next/link';
import { Suspense } from 'react';

export interface OrgCardProps {
  name: string;
  location?: string | null;
  profilePicturePath: string | null;
  href?: string;
}

export default function OrgCard({ name, location, profilePicturePath, href }: OrgCardProps) {
  const PROFILE_PICTURE_SIZE = 75;

  const cardContent = (
    <div className="flex bg-background p-4 rounded-lg gap-4 items-center">
      <Suspense fallback={<ProfilePictureSkeleton size={PROFILE_PICTURE_SIZE} />}>
        <ProfilePictureContainer profilePicPath={profilePicturePath} size={PROFILE_PICTURE_SIZE} />
      </Suspense>
      <div className="flex flex-col flex-1">
        <h2>{name}</h2>
        {location && <p>{location}</p>}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return <div>{cardContent}</div>;
}
