import type { StoryObj, Meta } from '@storybook/react';

import HeroButton from './HeroButton';

export default {
  component: HeroButton,
  title: 'Buttons/HeroButton',
} satisfies Meta<typeof HeroButton>;

type Story = StoryObj<typeof HeroButton>;

export const Default: Story = {
  args: {
    children: 'Hero Button',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Hero Button',
    variant: 'danger',
  },
};
