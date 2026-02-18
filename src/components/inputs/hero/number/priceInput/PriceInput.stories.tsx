import type { StoryObj, Meta } from '@storybook/react';

import  PriceInput  from './PriceInput';

export default {
  component: PriceInput,
  title:"Inputs/Number/Price Input"
} satisfies Meta<typeof PriceInput>;

type Story = StoryObj<typeof PriceInput>;

export const Default: Story = {
  args: {
    required: true,
  },
};
