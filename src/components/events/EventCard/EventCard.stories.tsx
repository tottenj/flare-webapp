import type { StoryObj, Meta } from '@storybook/react';

import MainModal from '@/components/modals/MainModal/MainModal';
import EventCardPresentational from '@/components/events/EventCard/EventCardPresentational';

export default {
  component: EventCardPresentational,
  title: 'Events/Event Card',
  tags: ['autodocs'],
} satisfies Meta<typeof EventCardPresentational>;

type Story = StoryObj<typeof EventCardPresentational>;

export const Default: Story = {
  decorators: [
    (Story: Story) => (
      <div className="w-5xl border-2 border-gray-300 p-4 rounded-2xl">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Sample Event Title',
    image: 'stockEvent.jpg',
    organizer: 'Sample Organizer',
    tags: ['Drag', '19+'],
    date: new Date(4).toDateString(),
    location: 'The Opera House, Toronto, ON',
    description:
      "Join us for a fabulous nigjag drag performances, dancing, and community celebration. Don't miss cut on the fiercest queens and the hottestbeats in town! Lorem Ipsum is simply dummy text of the printing, and typesetting industry. Loreem Ipsum has been the industry's standard, dummy text over since the 1500s, when an unknown printer took a galley of type and scrambled it to make a specin book. It has survived not only five centu ries, but also the leap ev. tly inchanged, Join us for a fabulous nigjag drag performances, dancing, and community celebration. Don't miss cut on the fiercest queens and the hottestbeats in town! Lorem Ipsum is simply dummy text of the printing, and typesetting industry. Loreem Ipsum has been the industry's standard, dummy text over since the 1500s, when an unknown printer took a galley of type and scrambled it to make a specin book. It has survived not only five centu ries, but also the leap ev. tly inchanged,",
    price: '25.00 ',
  },
};
