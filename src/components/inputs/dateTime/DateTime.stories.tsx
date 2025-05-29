import type { StoryObj, Meta } from '@storybook/react';

import DateTime from './DateTime';

export default {
  component: DateTime,
} satisfies Meta<typeof DateTime>;

type Story = StoryObj<typeof DateTime>;

export const Default: Story = {
  args: {},
};
