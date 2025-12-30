import type { StoryObj, Meta } from '@storybook/react';

import OrgSignUpFormPresentational from './OrgSignUpFormPresentational';

export default {
  component: OrgSignUpFormPresentational,
  title: "Forms/Organization Sign Up Form",
  tags: ['autodocs']
} satisfies Meta<typeof OrgSignUpFormPresentational>;

type Story = StoryObj<typeof OrgSignUpFormPresentational>;

export const Default: Story = {
  args: {
    hasFile: () => {}
  },
};
