import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    './general/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@chromatic-com/storybook', '@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  typescript: {
    check: false,
  },
  features: {
    experimentalRSC: true,
  },
  viteFinal: async (config) => {
    if (
      config.resolve?.alias &&
      typeof config.resolve.alias === 'object' &&
      !Array.isArray(config.resolve.alias)
    ) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/firebase/auth/configs/clientApp':
          '@/lib/firebase/auth/configs/__mocks__/clientApp.ts',
      };
    }
    return config;
  },
};
export default config;
