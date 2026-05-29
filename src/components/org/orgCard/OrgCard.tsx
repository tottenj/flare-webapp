import ProfilePictureSkeleton from '@/components/profiles/profilePicture/presentational/ProfilePictureSkeleton';
import ProfilePictureContainer from '@/components/profiles/profilePicture/ProfilePictureContainer';
import Link from 'next/link';
import { Suspense } from 'react';

export interface OrgCardProps {
  name: string;
  location?: string | null;
  profilePicturePath: string | null;
  href?: string;
  dataCy?: string;
}

export default function OrgCard({
  name,
  location,
  profilePicturePath,
  href,
  dataCy,
}: OrgCardProps) {
  const PROFILE_PICTURE_SIZE = 75;

  const cardContent = (
    <div className="bg-background flex items-center gap-4 rounded-lg p-4">
      <Suspense fallback={<ProfilePictureSkeleton size={PROFILE_PICTURE_SIZE} />}>
        <ProfilePictureContainer profilePicPath={profilePicturePath} size={PROFILE_PICTURE_SIZE} />
      </Suspense>
      <div className="flex flex-1 flex-col">
        <h2>{name}</h2>
        {location && <p>{location}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} data-cy={dataCy}>
        {cardContent}
      </Link>
    );
  }

  return <div data-cy={dataCy}>{cardContent}</div>;
}
