import type { StoryObj, Meta } from '@storybook/react';

import AutocompleteContainer from './AutocompleteContainer';

export default {
  component: AutocompleteContainer,
  title: 'inputs/Autocomplete',
} satisfies Meta<typeof AutocompleteContainer>;

type Story = StoryObj<typeof AutocompleteContainer>;

const mockTags = [
  { key: 'music', label: 'Music' },
  { key: 'pride', label: 'Pride' },
  { key: 'community', label: 'Community' },
  { key: 'drag', label: 'Drag' },
];

const mockLoadTags = async (query: string) => {
  await new Promise((r) => setTimeout(r, 300)); // simulate latency
  return mockTags.filter((tag) => tag.label.toLowerCase().includes(query.toLowerCase()));
};

export const Default: Story = {
  args: {
    loadFunc: mockLoadTags,
    withChips: true,
    name: '',
    allowsCustomValue: true,
    label: 'Autocomplete',
  },
};

export const NoChips: Story = {
  args: {
    loadFunc: mockLoadTags,
    withChips: false,
    label: 'Filter tags',
  },
};

export const NoCustomValues: Story = {
  args: {
    loadFunc: mockLoadTags,
  },
};

export const ErrorState: Story = {
  args: {
    loadFunc: async () => {
      throw new Error('Failed to load tags');
    },
  },
};
