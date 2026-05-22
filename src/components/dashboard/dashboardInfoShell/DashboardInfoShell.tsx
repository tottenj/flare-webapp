import ProfilePictureSkeleton from '@/components/profiles/profilePicture/presentational/ProfilePictureSkeleton';
import { Suspense } from 'react';

interface DashboardInfoShellProps {
  profilePicture: React.ReactNode;
  editProfilePictureTrigger?: React.ReactNode;
  profileInfo: React.ReactNode;
  settingsTrigger: React.ReactNode;
  profilePicSize?: number;
}

export default function DashboardInfoShell({
  profilePicture,
  profileInfo,
  settingsTrigger,
  editProfilePictureTrigger,
  profilePicSize = 175,
}: DashboardInfoShellProps) {
  return (
    <div className="relative flex h-full max-h-75 w-full items-center rounded-2xl bg-white p-4 shadow-2xl">
      <div data-cy="user-dashboard-settings" className="absolute top-2 right-2 h-fit w-fit">
        {settingsTrigger}
      </div>
      <div className="flex h-full items-center gap-8">
        <div className="relative">
          <div className="absolute top-0 right-0">
            {editProfilePictureTrigger}
          </div>
          <Suspense fallback={<ProfilePictureSkeleton size={profilePicSize} />}>
            {profilePicture}
          </Suspense>
        </div>
        <div className="flex flex-col">{profileInfo}</div>
      </div>
    </div>
  );
}
