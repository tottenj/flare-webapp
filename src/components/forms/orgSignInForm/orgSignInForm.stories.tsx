import type { StoryObj, Meta } from '@storybook/react';
import OrgSignInForm from './OrgSignInForm';
import { userEvent, within, expect } from '@storybook/test';



export default {
  component: OrgSignInForm,
  title: "Forms/Organization Sign Up Form",
} satisfies Meta<typeof OrgSignInForm>;

type Story = StoryObj<typeof OrgSignInForm>;

export const Default: Story = {
  args: {},

  play: async({canvasElement}) =>{
    const canvas = within(canvasElement)
    const pass = canvas.getByTestId("orgPassword")
    await userEvent.type(pass, 'password123')
    const confPass = canvas.getByTestId("confirmOrgPassword")
    await userEvent.type(confPass, 'password123')
    const err = canvas.queryByText('Passwords Must Match');
    expect(err).toBeNull()
  }
};

export const PasswordMisMatch: Story = {
  args: {},

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const pass = canvas.getByTestId('orgPassword');
    await userEvent.type(pass, 'password123');
    const confPass = canvas.getByTestId('confirmOrgPassword');
    await userEvent.type(confPass, 'password12');
    const err = canvas.queryByText('Passwords Must Match');
    expect(err).toBeInTheDocument()
  }
}
