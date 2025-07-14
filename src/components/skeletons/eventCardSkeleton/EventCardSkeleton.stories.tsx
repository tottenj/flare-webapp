import type { StoryObj, Meta } from '@storybook/nextjs';

import EventsListSkeleton from './EventCardSkeleton';

export default {
  component: EventsListSkeleton,
  title: "skeletons/Events List"
} satisfies Meta<typeof EventsListSkeleton>;

type Story = StoryObj<typeof EventsListSkeleton>;

export const Default: Story = {
  args: {},
};
