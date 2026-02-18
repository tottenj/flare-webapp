import type { StoryObj, Meta } from '@storybook/react';

import  ProfilePictureSkeleton  from './ProfilePictureSkeleton';

export default {
  component: ProfilePictureSkeleton,
  title: "Skeletons/Profile Picture Skeleton"
} satisfies Meta<typeof ProfilePictureSkeleton>;

type Story = StoryObj<typeof ProfilePictureSkeleton>;

export const Default: Story = {
  args: {
    size: 80,
  },
};
