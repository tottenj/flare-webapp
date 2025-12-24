import type { StoryObj, Meta } from '@storybook/react';

import  PrimaryButton  from './PrimaryButton';

export default {
  component: PrimaryButton,
} satisfies Meta<typeof PrimaryButton>;

type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
  args: {
    text: 'Submit',
    type: 'button',
    disabled: true,
    styleOver: undefined,
    size: 'small',
    action: undefined,
    click: undefined,
    form: '',
    datacy: '',
    state: 'initial',
  },
};
