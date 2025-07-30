import type { StoryObj, Meta } from '@storybook/nextjs';
import GoogleSignInButton from './SignInWithGoogleButton';



export default {
  component: GoogleSignInButton,
  title: "buttons/Google Sign In Button",
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof GoogleSignInButton>;

type Story = StoryObj<typeof GoogleSignInButton>;

export const Default: Story = {
  args: {
    signIn: true,
  },
};

export const signIn: Story = {
    args: {
        signIn: false
    }
}