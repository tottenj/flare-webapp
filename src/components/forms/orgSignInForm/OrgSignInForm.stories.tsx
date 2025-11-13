import type { StoryObj, Meta } from '@storybook/react';
import userEvent from '@testing-library/user-event';

import OrgSignInForm from './OrgSignInForm';
import { within } from '@testing-library/dom';

export default {
  component: OrgSignInForm,
} satisfies Meta<typeof OrgSignInForm>;

type Story = StoryObj<typeof OrgSignInForm>;

export const Default: Story = {
  args: {},
};

export const PasswordsDoNotMatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const passInput = canvas.getByLabelText('Choose Password');
    await userEvent.type(passInput, 'abc123');

    const confirmInput = canvas.getByLabelText('Confirm Password');
    await userEvent.type(confirmInput, 'different');

    await canvas.findByText('Passwords Must Match');
  },
};
