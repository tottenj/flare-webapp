import type { StoryObj, Meta } from '@storybook/react';

import IconButton  from './IconButton';
import { faGear } from '@fortawesome/free-solid-svg-icons';

export default {
  component: IconButton,
  title: "Buttons/IconButton",
} satisfies Meta<typeof IconButton>;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: faGear,
    size: 30,
  },
};

export const Secondary: Story = {
  args: {
    icon: faGear,
    size: 30,
    variant: 'secondary',
  },
};

export const Gradient: Story = {
  args: {
    icon: faGear,
    size: 30,
    variant: 'gradient',
  },
};
