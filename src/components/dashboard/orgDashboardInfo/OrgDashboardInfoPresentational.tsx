import ProfilePictureContainer from '@/components/profiles/profilePicture/ProfilePictureContainer';
import { Suspense } from 'react';

interface Props {
  email: string;
  orgName: string;
  status: string;
  profilePicPath?: string;

}

export default function OrgDashboardInfoPresentational({
  email,
  orgName,
  status,
  profilePicPath,
}: Props) {
  return (
    <div className="relative h-full w-full rounded-2xl bg-white p-4 shadow-2xl max-h-[250px]">
      <div className="flex h-full items-center gap-8">
        <Suspense>
          <ProfilePictureContainer profilePicPath={profilePicPath} size={200} />
        </Suspense>
        <div className="flex flex-col">
          <h1>{orgName}</h1>
          <p>{email}</p>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}
