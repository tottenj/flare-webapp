import type { StoryObj, Meta } from '@storybook/react';

import  HeroButton  from './HeroButton';
import { text } from 'stream/consumers';

export default {
  component: HeroButton,
  title: "Buttons/HeroButton",
} satisfies Meta<typeof HeroButton>;

type Story = StoryObj<typeof HeroButton>;

export const Default: Story = {
  args: {
    text: "Hero Button",
  },
};

export const Danger:Story = {
    args: {
        text: "Danger Hero Button",
        color: "danger",
    }
}