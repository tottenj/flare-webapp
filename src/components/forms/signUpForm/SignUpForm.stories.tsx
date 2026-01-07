import type { Meta, StoryObj } from '@storybook/react';
import SignUpFormPresentational from './SignUpFormPresentational';

const meta: Meta<typeof SignUpFormPresentational> = {
  title: 'Forms/User Sign Up Form',
  component: SignUpFormPresentational,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SignUpFormPresentational>;

export const Default: Story = {
  args: {
    pending: false,
    onSubmit: () => {},
  },
};

export const ValidationErrors: Story = {
  args: {
    validationErrors: {
      email: ['Email Error'],
    },
    pending: false,
    onSubmit: () => {},
  },
};

export const Pending: Story = {
  args: {
    pending: true,
    onSubmit: () => {},
  },
};

export const GeneralError: Story = {
  args: {
    pending: false,
    error: 'General Error',
    onSubmit: () => {},
  },
};

export const SignIn: Story = {
  args: {
    pending: false,
    signUp: false,
  },
};
