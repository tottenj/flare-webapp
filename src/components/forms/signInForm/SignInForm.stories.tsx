import type { Meta, StoryObj } from '@storybook/react';
import SignInForm from './SignInForm';
import { AuthProvider } from '@/components/context/AuthContext';

const meta = {
  decorators: [
    (Story) => (
      <AuthProvider>
      <div className="flex w-[95vw] justify-center">
        <Story />
      </div>
      </AuthProvider>
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
