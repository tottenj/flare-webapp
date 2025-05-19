import type { StoryObj, Meta } from '@storybook/react';

import MainBanner from './MainBanner';

export default {
  component: MainBanner,
  title: "Banners/Main Banner"
} satisfies Meta<typeof MainBanner>;

type Story = StoryObj<typeof MainBanner>;

export const Default: Story = {
  args: {},
};
