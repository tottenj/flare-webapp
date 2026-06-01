import type { StoryObj, Meta } from '@storybook/react';

import SaveEventButtonPresentational from './SaveEventButtonPresentational';

export default {
  title: 'Buttons/Save Event Button',
  component: SaveEventButtonPresentational,
  args: {
    onClick: () => {},
  },
} satisfies Meta<typeof SaveEventButtonPresentational>;

type Story = StoryObj<typeof SaveEventButtonPresentational>;

export const Default: Story = {
  args: {
    filled: true,
    disabled: false,
  },
};

export const Unsaved: Story = {
  args: {
    filled: false,
    disabled: false,
  },
};

export const SavedDisabled: Story = {
  args: {
    filled: true,
    disabled: true,
  },
};

export const UnsavedDisabled: Story = {
  args: {
    filled: false,
    disabled: true,
  },
};
