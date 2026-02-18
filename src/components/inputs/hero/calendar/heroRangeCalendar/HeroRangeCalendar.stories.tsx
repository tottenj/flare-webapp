import type { StoryObj, Meta } from '@storybook/react';

import HeroRangeCalendar from './HeroRangeCalendar';

export default {
  component: HeroRangeCalendar,
  title: 'Inputs/calendars/Hero Range Calendar',
} satisfies Meta<typeof HeroRangeCalendar>;

type Story = StoryObj<typeof HeroRangeCalendar>;

export const Default: Story = {
  args: {},
};
