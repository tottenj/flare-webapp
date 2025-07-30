import type { StoryObj, Meta } from '@storybook/nextjs';

import FileInput from './FileInput';

export default {
  component: FileInput,
  title: "Inputs/File Input"
} satisfies Meta<typeof FileInput>;

type Story = StoryObj<typeof FileInput>;

export const Default: Story = {
  args: {
    name: 'fileInput',
    buttonText: 'Proof of Ownership',
    required: true,
  },
};
