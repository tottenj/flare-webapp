import FilterModalPresentational from '@/components/events/filters/FilterModalPresentational';
import type { StoryObj, Meta } from '@storybook/react';



export default {
  component: FilterModalPresentational,
  title: "Events/Filters/FilterModalPresentational",
} satisfies Meta<typeof FilterModalPresentational>;

type Story = StoryObj<typeof FilterModalPresentational>;

export const Default: Story = {
  args: {
    category: undefined,
    location: undefined,
    onCategoryChange: undefined,
    onLocationChange: undefined,
    onClear: () => {},
  },
};
