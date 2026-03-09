import type { StoryObj, Meta } from '@storybook/react';

import DeleteAccountButton from './DeleteAccountButton';

export default {
  component: DeleteAccountButton,
  title: "Buttons/DeleteAccountButton",
} satisfies Meta<typeof DeleteAccountButton>;

type Story = StoryObj<typeof DeleteAccountButton>;

export const Default: Story = {
  args: {},
};
