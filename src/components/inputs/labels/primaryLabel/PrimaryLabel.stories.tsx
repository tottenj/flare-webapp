import type { StoryObj, Meta } from '@storybook/nextjs';
import PrimaryLabel from './PrimaryLabel';



export default {
  component: PrimaryLabel,
  title: "Inputs/Primary Label"
} satisfies Meta<typeof PrimaryLabel>;

type Story = StoryObj<typeof PrimaryLabel>;

export const Default: Story = {
  args: {label: "Label"},
};
