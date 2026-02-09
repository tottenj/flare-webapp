import type { StoryObj, Meta } from '@storybook/react';

import  EventCategorySelectItem  from './EventCategorySelectItem';
import { EventCategory } from '@/lib/types/EventCategory';

export default {
  component: EventCategorySelectItem,
  title: "Inputs/Selects/Items/Event Category Select Item"
} satisfies Meta<typeof EventCategorySelectItem>;

type Story = StoryObj<typeof EventCategorySelectItem>;

export const Default: Story = {
  args: {
    category: 'NIGHTLIFE' satisfies EventCategory,
  },
};
