import path from 'path';
import type { StorybookConfig } from '@storybook/nextjs';
import fs from 'fs';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

console.log('File exists?', fs.existsSync(path.resolve('src/lib/firebase/auth/configs')));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-docs',
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

    // Firebase and next mocks
    config.resolve.alias['firebase/auth'] = path.resolve(__dirname, '__mocks__/firebase/auth.ts');
    config.resolve.alias['firebase/firestore'] = path.resolve(
      __dirname,
      '__mocks__/firebase/firestore.ts'
    );
    config.resolve.alias['next/navigation'] = path.resolve(
      __dirname,
      '__mocks__/next/navigation.ts'
    );

    config.resolve.alias['src/lib/firebase/auth/configs'] = path.resolve(__dirname, '__mocks__/lib/firebase/auth/configs/getFirestoreFromServer')

  



    return config;
  },
};

export default config;
