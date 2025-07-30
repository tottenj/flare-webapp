import type { StoryObj, Meta } from '@storybook/nextjs';

import LinkInput  from './LinkInput';

export default {
  component: LinkInput,
  title: "inputs/Link"
} satisfies Meta<typeof LinkInput>;

type Story = StoryObj<typeof LinkInput>;

export const Default: Story = {
  args: {
    href: '',
    style: undefined,
    text: '',
  },
};
