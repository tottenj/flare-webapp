import type { StoryObj, Meta } from '@storybook/react';

import EventListCardPresentational from './EventListCardPresentational';
import EventListCardSkeleton from './EventListCardSkeleton';
import { render } from '@testing-library/react';

const meta = {
  component: EventListCardPresentational,
  title: 'Events/Event List Card',
  tags: ['autodocs'],

  argTypes: {
    loading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof EventListCardPresentational>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eventId: 'event-123',
    title: 'Queer Trivia Night',
    category: 'SOCIAL',
    description: 'Join us for games, laughs, and community vibes.',
    ageRestriction: 'ALL_AGES',
    startDate: '2026-02-15',
    loading: false,
  },

  render: (args: any) =>
    args.loading ? <EventListCardSkeleton /> : <EventListCardPresentational {...args} />,
};


export const Loading: Story = {
  render: () => <EventListCardSkeleton />
}