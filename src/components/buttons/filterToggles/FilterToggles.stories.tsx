import type { StoryObj, Meta } from '@storybook/react';

import FilterToggles from './FilterToggles';

export default {
  component: FilterToggles,
  title: "Toggles/Filter"
} satisfies Meta<typeof FilterToggles>;

type Story = StoryObj<typeof FilterToggles>;

export const Default: Story = {
  args: {},
};
