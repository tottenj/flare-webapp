import type { StoryObj, Meta } from '@storybook/react';

import HeroInput from './HeroInput';

export default {
  component: HeroInput,
  title: "Inputs/ Text Input"
} satisfies Meta<typeof HeroInput>;

type Story = StoryObj<typeof HeroInput>;

export const Default: Story = {
  args: {
    label: 'Label',
    type: 'text',
    placeholder: 'placeholder',
  },
};

export const Password: Story = {
  args: {
    label: 'Label',
    type: 'password',
    value: "lskdjflkj",
  },
};