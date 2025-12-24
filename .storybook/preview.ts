import { definePreview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';
import './fonts.css'
import { initialize } from 'msw-storybook-addon';
import addonA11y from '@storybook/addon-a11y';

initialize();

export default definePreview({
  addons: [addonA11y()],
  parameters:{
    layout: 'padded',
    backgrounds:{
      default: 'light',
    }
  },
  tags:['autodocs'],
});
