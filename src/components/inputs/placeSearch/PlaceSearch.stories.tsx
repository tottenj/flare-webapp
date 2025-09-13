import type { StoryObj, Meta } from '@storybook/nextjs';
import PlaceSearch from './PlaceSearch';
import { waitFor } from '@testing-library/dom';
import { userEvent, expect, within } from 'storybook/test';


export default {
  component: PlaceSearch,
  title: "Inputs/Place Search"
} satisfies Meta<typeof PlaceSearch>;

type Story = StoryObj<typeof PlaceSearch>;

export const Default: Story = {
  
  args: {
    lab: "Location"
  },
  play: async({canvasElement}) =>{
    const canvas = within(canvasElement)
    const locInput = canvas.getByRole('combobox');
    await userEvent.type(locInput, "guelph", {delay: 100});
 

  }
};
