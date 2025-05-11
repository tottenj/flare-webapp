import type { StoryObj, Meta } from '@storybook/react';
import PrimaryButton from './PrimaryButton';


export default {
  component: PrimaryButton,
} satisfies Meta<typeof PrimaryButton>;

type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
  args: {
    text: 'Submit',
    type: 'submit',
    disabled: false,
    styleOver: undefined,
    size: 'full',
    action: undefined,
    click: undefined,
  },
};

export const large: Story = {
  args: {
    text: 'Submit',
    type: 'submit',
    disabled: false,
    styleOver: undefined,
    size: 'large',
    action: undefined,
    click: undefined,
  },
};

export const medium: Story = {
  args: {
    text: 'Submit',
    type: 'submit',
    disabled: false,
    styleOver: undefined,
    size: 'medium',
    action: undefined,
    click: undefined,
  },
};


export const small: Story = {
  args: {
    text: 'Submit',
    type: 'submit',
    disabled: false,
    styleOver: undefined,
    size: 'small',
    action: undefined,
    click: undefined,
  },
};


export const disabled: Story = {
  args: {
    text: 'Submit',
    type: 'submit',
    disabled: true,
    styleOver: undefined,
    size: 'full',
    action: undefined,
    click: undefined,
  },
};