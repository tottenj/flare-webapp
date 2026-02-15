import type { StoryObj, Meta } from '@storybook/react';

import EventFormPresentational from './EventFormPresentational';

export default {
  component: EventFormPresentational,
  title: "Forms/Event Form"
} satisfies Meta<typeof EventFormPresentational>;

type Story = StoryObj<typeof EventFormPresentational>;

export const Default: Story = {
  decorators: [
    (Story: Story) => (
      <div className="w-5xl rounded-2xl border-2 border-gray-300 p-4">
        <Story />
      </div>
    ),
  ],
};

export const WithMultiDay: Story = {
  decorators: [
    (Story: Story) => (
      <div className="w-5xl rounded-2xl border-2 border-gray-300 p-4">
        <Story />
      </div>
    ),
  ],

  args:{
    isMultiDay: true
  }
};

