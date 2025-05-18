import type { StoryObj, Meta } from '@storybook/react';

import generalLoader from './generalLoader';

export default {
  component: generalLoader,
} satisfies Meta<typeof generalLoader>;

type Story = StoryObj<typeof generalLoader>;

export const Default: Story = {
  args: {},
};
