import type { StoryObj, Meta } from '@storybook/react';
import TextInput from './TextInput';
import {  expect, userEvent, within } from '@storybook/test';

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
  },
};

export const noLabel: Story = {
    args:{
        label: '',
        name: '',
        placeholder: 'placeholder',
    }
}

export const password: Story = {
    args: {
        label: "Password",
        name: '',
        placeholder: 'password',
        type: 'password'
    },
    play: async ({canvasElement}) => {
        const canvas = within(canvasElement)
        const passInput = canvas.getByPlaceholderText('password');
        await userEvent.type(passInput, 'password123')
        const test = canvas.queryByText('password123')
        expect(passInput).toHaveAttribute('type', 'password');
        await expect(passInput).toHaveValue('password123')
        expect(test).not.toBeInTheDocument()
    }
}