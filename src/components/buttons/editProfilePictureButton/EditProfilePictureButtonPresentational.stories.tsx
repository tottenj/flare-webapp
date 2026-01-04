import type { StoryObj, Meta } from '@storybook/react';

import EditProfilePictureButtonPresentational from './EditProfilePictureButtonPresentational';

export default {
  component: EditProfilePictureButtonPresentational,
  title: "Buttons/Edit Profile Picture Button"
} satisfies Meta<typeof EditProfilePictureButtonPresentational>;

type Story = StoryObj<typeof EditProfilePictureButtonPresentational>;

export const Default: Story = {
  args: {},
};
