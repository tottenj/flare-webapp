import type { StoryObj, Meta } from '@storybook/nextjs';
import EventsList from './EventsList';
import EventsListSkeleton from '@/components/skeletons/eventCardSkeleton/EventCardSkeleton';
import { Suspense } from 'react';
import { DelayWrapper } from '@/lib/utils/storybook/delayWrapper';
import Event from '@/lib/classes/event/Event';

export default {
  component: EventsList,
  title: 'eventsList',
} satisfies Meta<typeof EventsList>;

type Story = StoryObj<typeof EventsList>;

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-auto bg-white group-has-[button]:h-[80%] md:overflow-y-scroll">
    <Suspense fallback={<EventsListSkeleton />}>
      <DelayWrapper ms={100000}>{children}</DelayWrapper>
    </Suspense>
  </div>
);

export const Default: Story = {
  args: {
    plainQueriedEvents: Event.sampleEvents.map((even) => even.toPlain()),
  },
  render: (args) => <EventsList {...args} />,
};

export const withSkeleton: Story = {
  args: {
    plainQueriedEvents: Event.sampleEvents.map((even) => even.toPlain()),
  },
  render: (args) => (
    <SuspenseWrapper>
      <EventsList {...args} />
    </SuspenseWrapper>
  ),
};
