// cypress.config.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'f7wjfu',
  e2e: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
    baseUrl: 'http://localhost:3000', // Adjust to your app's URL
  },
  video: true,
  videosFolder: 'reports/cypress/videos',
  screenshotsFolder: 'reports/cypress/screenshots',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mocha-junit-reporter',
    mochaJunitReporterReporterOptions: {
      mochaFile: 'reports/cypress/junit-[hash].xml',
      toConsole: false,
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
