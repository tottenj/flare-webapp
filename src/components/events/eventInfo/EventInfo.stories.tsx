import type { StoryObj, Meta } from '@storybook/react';

import EventInfo from './EventInfo';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';

export default {
  component: EventInfo,
} satisfies Meta<typeof EventInfo>;

type Story = StoryObj<typeof EventInfo>;

export const Default: Story = {
  args: {
    img: '/prideHeart.png',
    event: Event.sampleEvents[0].toPlain(),
  },
};

export const noImage: Story = {
  args: {
    img: null,
    event: Event.sampleEvents[0].toPlain(),
  },
};
