import type { StoryObj, Meta } from '@storybook/react';

import EventListCardPresentational from './EventListCardPresentational';

export default {
  component: EventListCardPresentational,
  title: "Events/Event List Card"
} satisfies Meta<typeof EventListCardPresentational>;

type Story = StoryObj<typeof EventListCardPresentational>;

export const Default: Story = {
  args: {
    color: "SOCIAL"
  },
};
