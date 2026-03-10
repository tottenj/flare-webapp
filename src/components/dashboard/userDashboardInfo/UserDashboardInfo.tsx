import EditProfilePictureButtonContainer from '@/components/buttons/editProfilePictureButton/EditProfilePictureButtonContainer';
import IconButton from '@/components/buttons/iconButton/IconButton';
import MainModal from '@/components/modals/MainModal/MainModal';
import ProfilePictureSkeleton from '@/components/profiles/profilePicture/presentational/ProfilePictureSkeleton';
import ProfilePictureContainer from '@/components/profiles/profilePicture/ProfilePictureContainer';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Suspense } from 'react';

interface UserDashboardInfoProps {
  children: React.ReactNode;
  profilePicPath: string | null;
  settings?: React.ReactNode;
}

export default async function UserDashboardInfo({
  children,
  profilePicPath,
  settings,
}: UserDashboardInfoProps) {
  const profilePicSize = 175;

  return (
    <div className="relative flex h-full max-h-75 w-full items-center rounded-2xl bg-white p-4 shadow-2xl">
      {settings && (
        <div data-cy="user-dashboard-settings" className="absolute top-2 right-2 h-fit w-fit">
          <MainModal
            header="Settings"
            modalProps={{ size: '2xl' }}
            trigger={<IconButton icon={faGear} />}
          >
            {settings}
          </MainModal>
        </div>
      )}
      <div className="flex h-full items-center gap-8">
        <div className="relative">
          <EditProfilePictureButtonContainer />
          <Suspense fallback={<ProfilePictureSkeleton size={profilePicSize} />}>
            <ProfilePictureContainer
              priority
              profilePicPath={profilePicPath}
              size={profilePicSize}
            />
          </Suspense>
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}
