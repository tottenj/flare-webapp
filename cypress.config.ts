// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
    baseUrl: 'https://localhost:3000', // Adjust to your app's URL
    env: {
      FIREBASE_API_KEY: 'AIzaSyDj5h2HzdQYuOzV_UVTHiwx1golUW93INU',
      FIREBASE_AUTH_DOMAIN: 'flare-7091a.firebaseapp.com',
      FIREBASE_PROJECT_ID: "flare-7091a",
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
