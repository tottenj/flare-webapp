import type { StoryObj, Meta } from '@storybook/react';

import EventFormPresentational from './EventFormPresentational';

export default {
  component: EventFormPresentational,
  title: "Forms/Event Form"
} satisfies Meta<typeof EventFormPresentational>;

type Story = StoryObj<typeof EventFormPresentational>;

export const Default: Story = {
  args: {},
};
