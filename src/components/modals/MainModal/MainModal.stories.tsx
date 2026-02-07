import type { StoryObj, Meta } from '@storybook/react';
import MainModal from './MainModal';

export default {
  component: MainModal,
  title: 'Modals/MainModal',
  tags: ['autodocs'],
} satisfies Meta<typeof MainModal>;

type Story = StoryObj<typeof MainModal>;

export const Default: Story = {
  args: {
    trigger: <button>Open Modal</button>,
    header: 'Modal Header',
    children: 'This is the modal body content.',
    footer: (onClose: () => void) => <button onClick={onClose}>Close</button>,
    modalProps: {
      size: 'xl',
    },
    defaultOpen: true
  },
};

export const Open: Story = {
  args: {
    trigger: <button>Open Modal</button>,
    header: 'Modal Header',
    children: 'This is the modal body content.',
    footer: (onClose: () => void) => <button onClick={onClose}>Close</button>,
    modalProps: {
      size: 'md',
    },
  },
};