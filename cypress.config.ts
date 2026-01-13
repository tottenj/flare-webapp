// cypress.config.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { defineConfig } from 'cypress';
import { execSync } from 'child_process';


export default defineConfig({
  projectId: 'f7wjfu',
  e2e: {
    specPattern: '__tests__/e2e/**/*.cy.{js,jsx,ts,tsx}',
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      on('task', {
        'db:resetAndSeed': () => {
          console.log('Resetting and seeding the database...');
          execSync('npm run db:reset && npm run seed:test', {
            stdio: 'inherit',
            env: { ...process.env, DATABASE_URL: config.env.DATABASE_URL },
          });
          console.log('Database is ready.');
          return null;
        },
        'db:reset': () => {
          execSync('npm run db:reset', {
            stdio: 'inherit',
            env: { ...process.env, DATABASE_URL: config.env.DATABASE_URL },
          });
          return null;
        },
        'db:seed': () => {
          execSync('npm run seed:test', {
            stdio: 'inherit',
            env: { ...process.env, DATABASE_URL: config.env.DATABASE_URL },
          });
          return null;
        },

       
      });
    },
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
  },
  env: {
    FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
    FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
    FIREBASE_STORAGE_EMULATOR_HOST: '127.0.0.1:9199',
  },
  video: true,
  videosFolder: 'reports/cypress/videos',
  screenshotsFolder: 'reports/cypress/screenshots',
});
