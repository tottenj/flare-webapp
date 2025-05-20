import type { StoryObj, Meta } from '@storybook/react';

import EventCard  from './EventCard';
import Event from '@/lib/classes/event/Event';

export default {
  component: EventCard,
} satisfies Meta<typeof EventCard>;

type Story = StoryObj<typeof EventCard>;


export const Default: Story = {
  args: {
    event: Event.sampleEvents[0],
  },
};
