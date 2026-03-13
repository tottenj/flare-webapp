import type { StoryObj, Meta } from '@storybook/react';

import DashboardInfoShell from './DashboardInfoShell';
import ProfilePicture from '@/components/profiles/profilePicture/presentational/ProfilePicture';
import IconButton from '@/components/buttons/iconButton/IconButton';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import EditProfilePictureButtonPresentational from '@/components/buttons/editProfilePictureButton/EditProfilePictureButtonPresentational';
import ProfilePictureSkeleton from '@/components/profiles/profilePicture/presentational/ProfilePictureSkeleton';

export default {
  title: 'Dashboard/DashboardInfoShell',
  component: DashboardInfoShell,
  decorators: [
    (Story: Story) => (
      <div className="flex h-[220px] w-[600px] items-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DashboardInfoShell>;
type Story = StoryObj<typeof DashboardInfoShell>;

export const Default: Story = {
  args: {
    profilePicture: <ProfilePicture size={175} />,
    profileInfo: (
      <div>
        <p className="font-semibold">Rainbow Collective</p>
        <p className="text-sm text-gray-500">contact@rainbow.org</p>
        <p className="text-xs">Verified</p>
      </div>
    ),
    settingsTrigger: <IconButton icon={faGear} />,
    editProfilePictureTrigger: (
      <EditProfilePictureButtonPresentational onChange={() => {}} isDisabled={false} />
    ),
    profilePicSize: 175,
  },
};

export const LoadingProfilePicture: Story = {
  args: {
    profilePicture: <ProfilePictureSkeleton size={175} />,
    profileInfo: (
      <div>
        <p className="font-semibold">Rainbow Collective</p>
        <p className="text-sm text-gray-500"></p>
        <p className="text-xs">Verified</p>
      </div>
    ),
    settingsTrigger: <IconButton icon={faGear} />,
    editProfilePictureTrigger: (
      <EditProfilePictureButtonPresentational onChange={() => {}} isDisabled={true} />
    ),
    profilePicSize: 175,
  },
};
