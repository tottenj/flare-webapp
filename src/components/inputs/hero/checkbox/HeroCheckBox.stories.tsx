import type { StoryObj, Meta } from '@storybook/react';

import HeroCheckBox from './HeroCheckBox';

export default {
  component: HeroCheckBox,
  title: 'Inputs/Checkbox/Hero Checkbox',
} satisfies Meta<typeof HeroCheckBox>;

type Story = StoryObj<typeof HeroCheckBox>;

export const Default: Story = {
  args: {},
};

export const WithLabel:Story={
  args:{
    children: "Label",
  }
}