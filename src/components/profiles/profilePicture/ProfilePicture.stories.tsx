import type { StoryObj, Meta } from '@storybook/react';
import  ProfilePicture  from './ProfilePicture';

export default {
  component: ProfilePicture,
  title: "UI/Profile Picture"
} satisfies Meta<typeof ProfilePicture>;

type Story = StoryObj<typeof ProfilePicture>;

export const Default: Story = {
  args: {
    size: 200,
    src: undefined,
  },
};
