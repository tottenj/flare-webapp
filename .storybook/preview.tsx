import type { Preview } from '@storybook/react';
import '../src/app/globals.css';
import MockAuthProvider from './__mocks__/MockAuthProvider';
import React from 'react';
import { initialize, mswLoader } from 'msw-storybook-addon';

// Initialize MSW if you're using it
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
    nextjs: {
      router: {
        basePath: '',
        pathname: '/',
        query: {},
        asPath: '/',
        push: () => Promise.resolve(true),
        replace: () => Promise.resolve(true),
        // Add other router methods you need
      },
    },
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
