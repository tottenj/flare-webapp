import type { Preview } from '@storybook/nextjs-vite'
import type { Decorator } from '@storybook/react';
import '../src/app/globals.css'
import './fonts.css';
import { sb } from 'storybook/test';


sb.mock(import("../src/lib/serverActions/uploadProfilePicture.ts"))
sb.mock(import("../src/lib/firebase/auth/configs/clientApp.ts"))

const withWrapper: Decorator = (Story) => (
  <div className='w-full h-full flex justify-center items-center'>
    <Story />
  </div>
);


const preview: Preview = {
  decorators: [withWrapper],
  parameters: {
    nextjs:{
      appDirectory:true
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