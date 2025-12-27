import type { StoryObj, Meta } from '@storybook/react';

import OrgSignUpFormPresentational from './OrgSignUpFormPresentational';

export default {
  component: OrgSignUpFormPresentational,
  title: "Forms/Organization Sign Up Form"
} satisfies Meta<typeof OrgSignUpFormPresentational>;

type Story = StoryObj<typeof OrgSignUpFormPresentational>;

export const Default: Story = {
  args: {},
};
