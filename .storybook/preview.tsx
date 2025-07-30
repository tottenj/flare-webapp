import type { Preview } from '@storybook/nextjs';
import '../src/app/globals.css';
import MockAuthProvider from './__mocks__/MockAuthProvider';
import React from 'react';
import { initialize, mswLoader } from 'msw-storybook-addon';


initialize();

const preview: Preview = {
  decorators: [
    (Story) => (
      <MockAuthProvider>
        <Story/>
      </MockAuthProvider>
    )
  ],
  parameters: {

    backgrounds: {
      values: [
        { name: 'light', value: '#fff' },
        { name: 'dark', value: 'oklch(16.15% 0.0828 273.4)' },
        { name: 'grad', value: 'linear-gradient(135deg, #ffa301, #ff005c)' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
