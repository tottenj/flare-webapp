import type { StoryObj, Meta } from '@storybook/react';

import QueryTabs from './QueryTabs';

export default {
  component: QueryTabs,
  title: 'Inputs/Tabs/QueryTabs',
} satisfies Meta<typeof QueryTabs>;

type Story = StoryObj<typeof QueryTabs>;

export const Default: Story = {
  args: {
    param: '',
    defaultValue: 'tab1',
    tabs: [
      { key: 'tab1', label: 'Tab One' },
      { key: 'tab2', label: 'Tab Two' },
      { key: 'tab3', label: 'Tab Three' },
    ],
  },
};

export const Primary: Story = {
  args: {
    color: "primary",
    param: '',
    defaultValue: 'tab1',
    tabs: [
      { key: 'tab1', label: 'Tab One' },
      { key: 'tab2', label: 'Tab Two' },
      { key: 'tab3', label: 'Tab Three' },
    ],
  },
};