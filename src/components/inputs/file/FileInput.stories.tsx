import type { StoryObj, Meta } from '@storybook/react';

import FileInput from './FileInput';

export default {
  component: FileInput,
  title: 'Inputs/File Input',
} satisfies Meta<typeof FileInput>;

type Story = StoryObj<typeof FileInput>;

export const Default: Story = {
  args: {
    name: 'File Input',
    buttonText: 'Button Text',
    required: true,
    onChange: undefined,
    fileAdded: false,
  },
};

export const FileAdded: Story = {
  args: {
    name: 'File Input',
    buttonText: 'Button Text',
    required: true,
    onChange: undefined,
    fileAdded: true,
  },
};