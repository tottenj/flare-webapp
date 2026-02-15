import type { StoryObj, Meta } from '@storybook/react';

import EventListCardPresentational from './EventListCardPresentational';

export default {
  component: EventListCardPresentational,
  title: "Events/Event List Card"
} satisfies Meta<typeof EventListCardPresentational>;

type Story = StoryObj<typeof EventListCardPresentational>;

export const Default: Story = {
  args: {
    eventId: 'event-123',
    title: 'Queer Trivia Night',
    category: 'SOCIAL',
    description: 'Join us for games, laughs, and community vibes.',
    ageRestriction: 'ALL_AGES',
    startDate: 'Feb 15, 2026',
  },
};
