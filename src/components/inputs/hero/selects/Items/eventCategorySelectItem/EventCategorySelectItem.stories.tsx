import type { StoryObj, Meta } from '@storybook/react';
import { EventCategory } from '@/lib/types/EventCategory';
import EventCategorySelectItem from '@/components/inputs/hero/selects/Items/eventCategorySelectItem/EventCategorySelectItem';

export default {
  component: EventCategorySelectItem,
  title: 'Inputs/Selects/Items/Event Category Select Item',
} satisfies Meta<typeof EventCategorySelectItem>;

type Story = StoryObj<typeof EventCategorySelectItem>;

export const Default: Story = {
  args: {
    category: 'NIGHTLIFE' satisfies EventCategory,
  },
};
