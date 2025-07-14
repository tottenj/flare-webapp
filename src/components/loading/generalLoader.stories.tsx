import type { StoryObj, Meta } from '@storybook/nextjs';
import GeneralLoader from './GeneralLoader';


export default {
  component: GeneralLoader,
  title: "loaders/General Loader"
} satisfies Meta<typeof GeneralLoader>;

type Story = StoryObj<typeof GeneralLoader>;

export const Default: Story = {
  args: {},
};
