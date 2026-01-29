import type { StoryObj, Meta } from '@storybook/react';

import  IconText  from './IconText';
import { faIcons } from '@fortawesome/free-solid-svg-icons';

export default {
  component: IconText,
  title: "UI/Icon Text"
} satisfies Meta<typeof IconText>;

type Story = StoryObj<typeof IconText>;

export const Default: Story = {
  args: {
    text: 'Sample Text',
    icon: faIcons,
  },
};

