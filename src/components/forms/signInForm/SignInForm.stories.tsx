import type { Meta, StoryObj } from '@storybook/react';
import SignInForm from './SignInForm';
import { expect, userEvent, within } from '@storybook/test';
import * as authModule from '@/lib/firebase/auth/emailAndPasswordAuth/emailAndPasswordActionCreation';

let submittedData: Record<string, FormDataEntryValue> | null = null;

async function mockAction(_prevState: any, formData: FormData) {
  submittedData = {
    email: formData.get('email')!,
    password: formData.get('password')!,
  };
  return { message: 'mocked response' };
}


const meta = {
  decorators: [
    (Story) => (
      <div className="flex w-[95vw] justify-center">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
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


export const Default: Story = {
  args:{
    overrideAction: mockAction
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const emal = canvas.getByPlaceholderText('example@gmail.com')
    await userEvent.type(emal, "example@gmail.com", {delay: 100})
    const pass = canvas.getByPlaceholderText('**********');
    await userEvent.type(pass, "password", {delay: 200});
    const but = canvas.getByText('Submit')
    await userEvent.click(but)
    await new Promise((r) => setTimeout(r, 500));

    expect(submittedData).toEqual({
      email: 'example@gmail.com',
      password: "password"
    })
   
  }
};
