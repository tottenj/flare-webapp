import type { StoryObj, Meta } from '@storybook/nextjs';

import Calendar  from './Calendar';
import Event from '@/lib/classes/event/Event';

export default {
  component: Calendar,
} satisfies Meta<typeof Calendar>;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    events: Event.sampleEvents.map((even) => even.toPlain()),
  },
};
