import { definePreview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';
import './fonts.css'

import addonA11y from '@storybook/addon-a11y';

export default definePreview({
  addons: [addonA11y()],
  parameters:{
    layout: 'padded',
    backgrounds:{
      default: 'light',
    }
  }
});
