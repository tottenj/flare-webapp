import EditProfilePictureButtonContainer from '@/components/buttons/editProfilePictureButton/EditProfilePictureButtonContainer';
import DashboardInfoShell from '@/components/dashboard/dashboardInfoShell/DashboardInfoShell';
import ProfilePictureContainer from '@/components/profiles/profilePicture/ProfilePictureContainer';
import { PROFILE_PIC_SIZE } from '@/lib/constants/dashboardConstants';

export default function DashboardInfoShellContainer({
  profilePicPath,
  ...shellProps
}: Omit<
  React.ComponentProps<typeof DashboardInfoShell>,
  'editProfilePictureTrigger' | 'profilePicture' | 'profilePicSize'
> & {
  profilePicPath: string | null;
}) {
  return (
    <DashboardInfoShell
      profilePicSize={PROFILE_PIC_SIZE}
      profilePicture={
        <ProfilePictureContainer profilePicPath={profilePicPath} size={PROFILE_PIC_SIZE} />
      }
      editProfilePictureTrigger={<EditProfilePictureButtonContainer />}
      {...shellProps}
    />
  );
}
