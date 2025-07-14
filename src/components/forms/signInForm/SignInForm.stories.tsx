import type { StoryObj, Meta } from '@storybook/nextjs';

import SignInForm from './SignInForm';

export default {
  component: SignInForm,
  title: "forms/Sign In Form"
} satisfies Meta<typeof SignInForm>;

type Story = StoryObj<typeof SignInForm>;

export const Default: Story = {
  args: {},
};
