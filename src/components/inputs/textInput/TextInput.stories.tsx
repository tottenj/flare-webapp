import type { StoryObj, Meta } from '@storybook/react';
import TextInput from './TextInput';
import { userEvent, within } from '@storybook/test';

export default {
  component: TextInput,
  title: "Inputs/Text Input",
  parameters: {
    layout: "centered"
  }

} satisfies Meta<typeof TextInput>;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    label: 'Label',
    name: '',
    placeholder: 'placeholder',
    password: false,
  },
};

export const noLabel: Story = {
    args:{
        label: '',
        name: '',
        placeholder: 'placeholder',
        password: false
    }
}

export const password: Story = {
    args: {
        label: "Password",
        name: '',
        placeholder: 'password',
        password: true
    },
    play: async ({canvasElement}) => {
        const canvas = within(canvasElement)
        const passInput = canvas.getByPlaceholderText('password');
        await userEvent.type(passInput, 'password123', {delay: 100})
    }
}