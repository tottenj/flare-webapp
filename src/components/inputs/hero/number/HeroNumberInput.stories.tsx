import type { StoryObj, Meta } from '@storybook/react';

import  HeroNumberInput  from './HeroNumberInput';

export default {
  component: HeroNumberInput,
  title: "Inputs/Number/Hero Number Input"
} satisfies Meta<typeof HeroNumberInput>;

type Story = StoryObj<typeof HeroNumberInput>;

export const Default: Story = {
  args: {},
};
