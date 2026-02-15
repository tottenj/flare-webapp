import type { StoryObj, Meta } from '@storybook/react';

import  ImageCropperInput  from './ImageCropperInput';

export default {
  component: ImageCropperInput,
  title: "Inputs/Image Cropper"
} satisfies Meta<typeof ImageCropperInput>;

type Story = StoryObj<typeof ImageCropperInput>;

export const Default: Story = {
  args: {
    label: 'Crop Image',
    aspect: 1,
    onCropped: undefined,
  },
};
