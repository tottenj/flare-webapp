import type { StoryObj, Meta } from '@storybook/react';
import ProfilePicture from './ProfilePicture';
import ProfilePictureSkeleton from '@/components/profiles/profilePicture/presentational/ProfilePictureSkeleton';

const meta: Meta<typeof ProfilePicture> = {
  component: ProfilePicture,
  title: 'UI/Profile Picture',
  args: {
    size: 200,
    src: undefined,
    loading: false,
  },
};

export default meta;

type Story = StoryObj<typeof ProfilePicture>;

export const Default: Story = {
  render: (args: any) =>
    args.loading ? <ProfilePictureSkeleton size={args.size} /> : <ProfilePicture {...args} />,
};

export const Loading: Story = {
  render: (args: any) => <ProfilePictureSkeleton size={args.size} />,
};
