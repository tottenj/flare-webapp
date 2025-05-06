import type { Preview } from '@storybook/react';
import '../src/app/globals.css';

if (typeof window !== 'undefined' && process.env.STORYBOOK === 'true') {
  jest.mock('firebase/auth', () => ({
    getAuth: () => ({
      currentUser: null,
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      signOut: jest.fn(),
    }),
  }));

  jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
    getApps: () => [],
  }));
}

const preview: Preview = {
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
