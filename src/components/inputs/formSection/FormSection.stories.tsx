import type { StoryObj, Meta } from '@storybook/react';

import  FormSection  from './FormSection';

export default {
  component: FormSection,
  title: "Inputs/Form Section"
} satisfies Meta<typeof FormSection>;

type Story = StoryObj<typeof FormSection>;

export const Default: Story = {
  args: {
    text: 'Text',
    blurb: 'blurb',
  },
};
