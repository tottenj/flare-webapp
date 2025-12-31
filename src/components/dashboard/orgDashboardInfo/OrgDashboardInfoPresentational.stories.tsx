import type { StoryObj, Meta } from '@storybook/react';

import  OrgDashboardInfoPresentational  from './OrgDashboardInfoPresentational';

export default {
  component: OrgDashboardInfoPresentational,
  title: "Dashboard/Organization/Info Block"
} satisfies Meta<typeof OrgDashboardInfoPresentational>;

type Story = StoryObj<typeof OrgDashboardInfoPresentational>;

export const Default: Story = {
  args: {
    email: 'example@gmail.com',
    orgName: 'Organization Name',
    status: 'PENDING',
    profilePicPath: undefined,
  },
};
