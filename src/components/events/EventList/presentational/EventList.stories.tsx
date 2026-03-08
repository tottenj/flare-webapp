import type { Meta, StoryObj } from '@storybook/react';
import EventList from './EventList';
import EventListSkeleton from './EventListSkeleton';
import { EventDto } from '@/lib/types/dto/EventDto';

const sampleEvents: Partial<EventDto>[] = [
  {
    id: '1',
    title: 'Queer Trivia Night',
    category: 'SOCIAL',
    description: 'Join us for games, laughs, and community vibes.',
    ageRestriction: 'ALL_AGES',
    startsAt: '2026-02-15T19:00:00Z',
  },
  {
    id: '2',
    title: 'Drag Bingo',
    category: 'CULTURE_ARTS',
    description: 'Prizes, laughs, and fabulous performances.',
    ageRestriction: 'AGE_18_PLUS',
    startsAt: '2026-02-18T20:00:00Z',
  },
  {
    id: '3',
    title: 'Community Dance Party',
    category: 'WELLNESS',
    description: 'Dance the night away with the community.',
    ageRestriction: 'AGE_19_PLUS',
    startsAt: '2026-02-20T22:00:00Z',
  },
];

const meta = {
  component: EventList,
  title: 'Events/Event List',
  tags: ['autodocs'],

  argTypes: {
    loading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof EventList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: sampleEvents as EventDto[],
    loading: false,
  },

  render: (args: any) =>
    args.loading ? <EventListSkeleton numEvents={args.events.length} /> : <EventList events={args.events} />,
};

export const Loading: Story = {
  args: {
    loading: true,
  },

  render: () => <EventListSkeleton />,
};
