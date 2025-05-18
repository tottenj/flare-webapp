import type { StoryObj, Meta } from '@storybook/react';
import OrgSignInForm from './OrgSignInForm';



export default {
  component: OrgSignInForm,
  title: "Forms/Organization Sign Up Form",
} satisfies Meta<typeof OrgSignInForm>;

type Story = StoryObj<typeof OrgSignInForm>;

export const Default: Story = {
  args: {},
};
