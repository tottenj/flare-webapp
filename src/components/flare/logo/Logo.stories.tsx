import type { StoryObj, Meta } from '@storybook/react';

import  Logo  from './Logo';

export default {
  component: Logo,
  title: "brand assets/Logo"
} satisfies Meta<typeof Logo>;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    size: 123,
  },
};
