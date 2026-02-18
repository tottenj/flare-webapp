import type { Meta, StoryObj } from '@storybook/react';
import HeroSelect from './HeroSelect';

export default {
  component: HeroSelect,
  title: 'Inputs/Selects/HeroSelect',
} satisfies Meta<typeof HeroSelect>;

type Story = StoryObj<typeof HeroSelect>;

export const Default: Story = {
  args: {
    label: 'Choose something',
    children: (
      <>
        <HeroSelect.Item key="one">Child One</HeroSelect.Item>
        <HeroSelect.Item key="two">Child Two</HeroSelect.Item>
      </>
    ),
  },
};
