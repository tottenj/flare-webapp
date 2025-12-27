import type { Meta, StoryObj } from '@storybook/react';
import PrimaryButton from './PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Buttons/Primary Button',
  component: PrimaryButton,
};

export default meta;

type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
  args: {
    text: 'Submit',
    type: 'button',
    disabled: false,
    styleOver: undefined,
    size: 'small',
    action: undefined,
    click: undefined,
    form: '',
    datacy: '',
    state: 'initial',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Full: Story = {
  args: {
    ...Default.args,
    size: 'full',
  },
};
