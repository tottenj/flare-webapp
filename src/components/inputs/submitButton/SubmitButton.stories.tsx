import type { StoryObj, Meta } from '@storybook/react';
import SubmitButton from './SubmitButton';

export default {
  component: SubmitButton,
  title: 'Buttons/Submit Button',
} satisfies Meta<typeof SubmitButton>;

type Story = StoryObj<typeof SubmitButton>;

export const Default: Story = {
  parameters: {
    layout: 'centered',
  },
  args: {
    text: 'Submit',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    text: 'Submit',
    disabled: true,
  },

  parameters: {
    layout: 'centered',
  },
};
