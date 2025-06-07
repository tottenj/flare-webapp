// cypress.config.ts
import dotenv from 'dotenv';
dotenv.config({path: '.env'});



import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
    baseUrl: 'http://localhost:3000', // Adjust to your app's URL
    env: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
