import type { StoryObj, Meta } from '@storybook/react';

import OrgCard from './OrgCard';

export default {
  title: 'Organizations/Org Card',
  component: OrgCard,
} satisfies Meta<typeof OrgCard>;

type Story = StoryObj<typeof OrgCard>;

export const Default: Story = {
  args: {
    name: 'Flare Community Center',
    location: 'Chicago, IL',
    profilePicturePath: null,
    href: '/admin/org/org_123',
  },
};
