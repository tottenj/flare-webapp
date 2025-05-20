import type { StoryObj, Meta } from '@storybook/react';

import MainModal  from './MainModal';

export default {
  component: MainModal,
} satisfies Meta<typeof MainModal>;

type Story = StoryObj<typeof MainModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};
