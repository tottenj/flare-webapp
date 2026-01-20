import type { StoryObj, Meta } from '@storybook/react';
import EventCardPresentational from '@/components/events/EventCard/EventCardPresentational';
import { time } from 'console';

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
    time: new Date(4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: 'The Opera House, Toronto, ON',
    description:
      "Join us for a fabulous nigjag drag performances, dancing, and community celebration. Don't miss cut on the fiercest queens and the hottestbeats in town! Lorem Ipsum is simply dummy text of the printing, and typesetting industry. Loreem Ipsum has been the industry's standard, dummy text over since the 1500s, when an unknown printer took a galley of type and scrambled it to make a specin book. It has survived not only five centu ries, but also the leap ev. tly inchanged, Join us for a fabulous nigjag drag performances, dancing, and community celebration. Don't miss cut on the fiercest queens and the hottestbeats in town! Lorem Ipsum is simply dummy text of the printing, and typesetting industry. Loreem Ipsum has been the industry's standard, dummy text over since the 1500s, when an unknown printer took a galley of type and scrambled it to make a specin book. It has survived not only five centu ries, but also the leap ev. tly inchanged,",
    price: '25.00 ',
  },
};


export const RealFlyer: Story = {
  decorators: [
    (Story: Story) => (
      <div className="w-5xl rounded-2xl border-2 border-gray-300 p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Drag Bingo - Love Edition',
    image: 'sampleEvent2.jpg',
    organizer: 'TroyBoy Entertainment',
    tags: ['Drag', '19+'],
    date: 'Friday, Feb. 13th',
    time: new Date(4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: 'Palmerston Legion Br. 409',
    description:'Welcome to the funnest Drag Night possible! Drag Bingo ft. TroyBoy Entertainment, we are excited to bring to you a live, intimate, fun night of live entertainment while raising money for Minto Pride! Drag, BINGO, & Prizes in an interactive environment! Lets play with balls!',
    price: '15.00 ',
    ticketLink: 'https://example.com/tickets',
  },
};
