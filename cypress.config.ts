// cypress.config.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { defineConfig } from 'cypress';
import { execSync } from 'child_process';
import { resetTestDbFast } from './__tests__/utils/restTestDb';
import { seedTest } from './prisma/seedTest';
import { PrismaClient } from '@prisma/client';

export default defineConfig({
  projectId: 'f7wjfu',
  e2e: {
    specPattern: '__tests__/e2e/**/*.cy.{js,jsx,ts,tsx}',
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      if (!process.env.DATABASE_URL) {
        process.env.DATABASE_URL = config.env.DATABASE_URL || process.env.DATABASE_URL;
      }
      const prisma = new PrismaClient();
      on('task', {
        'db:resetAndSeed': async () => {
          await resetTestDbFast(prisma);
          await seedTest(prisma);
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
      on('after:run', async () => {
        await prisma.$disconnect();
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
