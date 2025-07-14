import type { StoryObj, Meta } from '@storybook/nextjs';

import MainModal  from './MainModal';

export default {
  component: MainModal,
  title: "modals/Main Modal"
} satisfies Meta<typeof MainModal>;

type Story = StoryObj<typeof MainModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};
