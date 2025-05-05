import type { Meta, StoryObj } from '@storybook/react';
import SignInForm from './SignInForm';

const meta = {
  decorators: [
    (Story) => (
      <div className="flex w-[95vw] justify-center">
        <Story />
      </div>
    ),
  ],
  component: SignInForm,
  title: 'Forms/Login Form',
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'grad',
    },
  },
} satisfies Meta<typeof SignInForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
