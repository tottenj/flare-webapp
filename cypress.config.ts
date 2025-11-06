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
    baseUrl: 'http://127.0.0.1:3000', // Adjust to your app's URL
    chromeWebSecurity: false,
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
});
