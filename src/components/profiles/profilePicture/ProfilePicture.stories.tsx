import type { StoryObj, Meta } from '@storybook/react';

import  ProfilePicture  from './ProfilePicture';

export default {
  component: ProfilePicture,
} satisfies Meta<typeof ProfilePicture>;

type Story = StoryObj<typeof ProfilePicture>;

export const Default: Story = {
  args: {
    size: 120,
    src: "/defaultProfile.svg"
  },
};
