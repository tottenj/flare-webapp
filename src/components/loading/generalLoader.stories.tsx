import type { StoryObj, Meta } from '@storybook/react';
import GeneralLoader from './GeneralLoader';


export default {
  component: GeneralLoader,
} satisfies Meta<typeof GeneralLoader>;

type Story = StoryObj<typeof GeneralLoader>;

export const Default: Story = {
  args: {},
};
