import type { StoryObj, Meta } from '@storybook/react';

import  PlaceSearch  from './PlaceSearch';

export default {
  component: PlaceSearch,
  title: "Inputs/Place Search"
} satisfies Meta<typeof PlaceSearch>;

type Story = StoryObj<typeof PlaceSearch>;

export const Default: Story = {
  args: {
    lab: 'Location',
    required: true,
    z: '2',
    defVal: undefined,
  },
};
