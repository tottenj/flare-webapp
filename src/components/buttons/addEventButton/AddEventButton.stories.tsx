import type { StoryObj, Meta } from '@storybook/react';

import AddEventButton from './AddEventButton';

export default {
  component: AddEventButton,
  title: "buttons/Add Event Button"
} satisfies Meta<typeof AddEventButton>;

type Story = StoryObj<typeof AddEventButton>;

export const Default: Story = {
  args: {},
};
