import type { StoryObj, Meta } from '@storybook/react';

import BaseSkeleton  from './BaseSkeleton';

export default {
  component: BaseSkeleton,
  title: 'UI/Skeletons/BaseSkeleton',
} satisfies Meta<typeof BaseSkeleton>;

type Story = StoryObj<typeof BaseSkeleton>;

export const Default: Story = {
  args: {
    className: 'w-48 h-48',
  },
};
