'use server';
import EditProfilePictureButtonContainer from '@/components/buttons/editProfilePictureButton/EditProfilePictureButtonContainer';
import ProfilePictureContainer from '@/components/profiles/profilePicture/ProfilePictureContainer';
import ProfilePictureSkeleton from '@/components/skeletons/ProfilePictureSkeleton/ProfilePictureSkeleton';
import { Suspense } from 'react';

interface Props {
  email: string;
  orgName: string;
  status: string;
  profilePicPath: string | null;
}

export default async function OrgDashboardInfoPresentational({
  email,
  orgName,
  status,
  profilePicPath,
}: Props) {
  const profilePicSize = 175;

  return (
    <div className="relative h-full max-h-[250px] w-full rounded-2xl bg-white p-4 shadow-2xl">
      <div className="flex h-full items-center gap-8">
        <div className="relative">
          <EditProfilePictureButtonContainer />
          <Suspense fallback={<ProfilePictureSkeleton size={profilePicSize} />}>
            <ProfilePictureContainer profilePicPath={profilePicPath} size={profilePicSize} />
          </Suspense>
        </div>
        <div className="flex flex-col">
          <h1>{orgName}</h1>
          <p>{email}</p>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}
