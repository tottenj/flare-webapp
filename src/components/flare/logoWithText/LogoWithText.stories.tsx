
import LogoWithText from '@/components/flare/logoWithText/LogoWithText';
import type { StoryObj, Meta } from '@storybook/react';

export default {
  component: LogoWithText,
  title: "Brand Assets/Logo With Text"
} satisfies Meta<typeof LogoWithText>;

type Story = StoryObj<typeof LogoWithText>;

export const Default: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const XLarge: Story = {
  args: {
    size: 'xLarge',
  },
};