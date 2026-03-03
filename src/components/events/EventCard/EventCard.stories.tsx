import type { StoryObj, Meta } from '@storybook/react';
import EventCardPresentational, { EventCardViewModel } from '@/components/events/EventCard/EventCardPresentational';

export default {
  component: EventCardPresentational,
  title: 'Events/Event Card',
  tags: ['autodocs'],
} satisfies Meta<typeof EventCardPresentational>;

type Story = StoryObj<typeof EventCardPresentational>;

const sampleEvent: EventCardViewModel = {
  id: 'event1',
  title: 'Sample Event Title',
  organizerName: 'Sample Organizer',
  imageUrl: '/stockEvent.jpg',
  tags: ['Drag', 'Community'],

  startDateLabel: 'Saturday, Mar. 12',
  startTimeLabel: '7:00 – 11:00 PM',
  timezoneLabel: 'EST',

  locationLabel: 'The Opera House, Toronto, ON',
  priceLabel: '$25.00',
  ageRestrictionLabel: '19+',

  description:
    "Join us for a fabulous drag night with performances, dancing, and community celebration. Don't miss the fiercest queens and the hottest beats in town!",
};

export const Default: Story = {
  decorators: [
    (Story: Story) => (
      <div className="max-w-5xl">
        <Story />
      </div>
    ),
  ],
  args: {
    event: sampleEvent,
  },
};

export const RealFlyer: Story = {
  decorators: [
    (Story: Story) => (
      <div className="max-w-5xl">
        <Story />
      </div>
    ),
  ],
  args: {
    event: {
      id: 'event2',
      title: 'Drag Bingo - Love Edition',
      organizerName: 'TroyBoy Entertainment',
      imageUrl: '/sampleEvent2.jpg',
      tags: ['Drag', '19+'],

      startDateLabel: 'Friday, Feb. 13th',
      startTimeLabel: '9:00 – 11:00 PM',
      timezoneLabel: 'PST',

      locationLabel: 'Palmerston Legion Br. 409',
      priceLabel: '$15.00',
      ageRestrictionLabel: 'All Ages',

      description:
        'Welcome to the funnest Drag Night possible! Drag Bingo ft. TroyBoy Entertainment — prizes, laughs, and community vibes while raising money for Minto Pride!',

      ticketLink: 'https://example.com/tickets',
    },
  },
};
