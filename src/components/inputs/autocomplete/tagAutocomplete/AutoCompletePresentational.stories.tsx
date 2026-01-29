import type { StoryObj, Meta } from '@storybook/react';

import AutoCompletePresentational from './AutoCompletePresentational';
import { AutoCompleteItem } from '@/components/inputs/autocomplete/tagAutocomplete/TagAutoCompleteContainer';
import { createFakeAsyncList } from '@/lib/test/fakeAutoCompleteList';

export default {
  component: AutoCompletePresentational,
  title:"inputs/Autocomplete/Tag Autocomplete"
} satisfies Meta<typeof AutoCompletePresentational>;

type Story = StoryObj<typeof AutoCompletePresentational>;
const fakeTags: AutoCompleteItem[] = [
  {
    key: 'drag',
    label: 'Drag',
    description: 'Drag performance',
  },
  {
    key: 'dance',
    label: 'Dance',
    description: 'Dance party',
  },
  {
    key: 'karaoke',
    label: 'Karaoke',
    description: 'Sing-along night',
  },
  {
    key: 'community',
    label: 'Community',
    description: 'Community meetup',
  },
];

export const Default: Story = {
  args: {
    list: createFakeAsyncList([
      { key: 'drag', label: 'Drag', description: 'Drag performance' },
      { key: 'dance', label: 'Dance', description: 'Dance party' },
      { key: 'karaoke', label: 'Karaoke', description: 'Sing-along night' },
    ]),
    label: 'Tags',
    placeholder: 'Type to search tags…',
  },
};
