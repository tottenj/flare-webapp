import type { StoryObj, Meta } from '@storybook/react';

import HeroChip from './HeroChip';
import { TAG_COLORS, tagClasses } from '@/lib/types/TagColour';

export default {
  component: HeroChip,
  title: 'Ui/Hero Chip',
} satisfies Meta<typeof HeroChip>;

type Story = StoryObj<typeof HeroChip>;



export const AllTagColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {TAG_COLORS.map((color) => (
        <HeroChip key={color} className={tagClasses(color)}>
          {color}
        </HeroChip>
      ))}
    </div>
  ),
};
