import type { StoryObj, Meta } from '@storybook/react';

import EventCategorySelect from './EventCategorySelect';

export default {
  component: EventCategorySelect,
  title: "Inputs/Selects/Event Category Select"
} satisfies Meta<typeof EventCategorySelect>;

type Story = StoryObj<typeof EventCategorySelect>;

export const Default: Story = {
  args: {},
};
