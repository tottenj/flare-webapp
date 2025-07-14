import type { StoryObj, Meta } from '@storybook/nextjs';

import  ProfilePictureSkeleton  from './ProfilePictureSkeleton';

export default {
  component: ProfilePictureSkeleton,
  title: "skeletons/Profile Picture"
} satisfies Meta<typeof ProfilePictureSkeleton>;

type Story = StoryObj<typeof ProfilePictureSkeleton>;

export const Default: Story = {
  args: {
    size: 123,
  },
};
