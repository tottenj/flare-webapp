import type { Preview } from '@storybook/nextjs';
//@ts-ignore
import '../src/app/globals.css';
import MockAuthProvider from './__mocks__/MockAuthProvider';
import { initialize } from 'msw-storybook-addon';
import { sb } from 'storybook/test';

initialize();

const preview: Preview = {
  decorators: [
    (Story) => (
      <MockAuthProvider>
        <div className='w-full h-full flex justify-center'>
          <Story />
        </div>
      </MockAuthProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      options: {
        light: { name: 'light', value: '#fff' },
        dark: { name: 'dark', value: 'oklch(16.15% 0.0828 273.4)' },
        grad: { name: 'grad', value: 'linear-gradient(135deg, #ffa301, #ff005c)' }
      },
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
