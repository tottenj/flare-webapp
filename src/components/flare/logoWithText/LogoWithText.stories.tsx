import type { StoryObj, Meta } from '@storybook/nextjs';

import  LogoWithText  from './LogoWithText';

export default {
  component: LogoWithText,
  title: "Brand Assets/Logo With Text"
} satisfies Meta<typeof LogoWithText>;

type Story = StoryObj<typeof LogoWithText>;

export const Default: Story = {
  args: {
    size: 123,
  },
};
