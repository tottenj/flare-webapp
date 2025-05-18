import path from 'path';
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  core: {
    builder: '@storybook/builder-webpack5',
  },
  features: {
    experimentalRSC: true,
  },
  webpackFinal: async (config) => {
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};

    // 👉 Aliasing Firebase modules to local mock file
    config.resolve.alias['@/lib/firebase/auth/auth.ts'] = path.resolve(
      __dirname,
      '__mocks__/authHelpers.ts'
    );

    config.resolve.alias['firebase/auth'] = path.resolve(__dirname, '__mocks__/firebase/auth.ts');
    config.resolve.alias['firebase/firestore'] = path.resolve(
      __dirname,
      '__mocks__/firebase/firestore.ts'
    );

    return config;
  },
};

export default config;
