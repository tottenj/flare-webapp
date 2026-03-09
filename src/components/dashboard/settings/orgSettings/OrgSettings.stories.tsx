import type { StoryObj, Meta } from '@storybook/react';

import OrgSettings from './OrgSettings';

export default {
  component: OrgSettings,
  title: 'Dashboard/Settings/OrgSettings',
} satisfies Meta<typeof OrgSettings>;

type Story = StoryObj<typeof OrgSettings>;

export const Default: Story = {
  decorators: [
    (Story: Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {},
};
