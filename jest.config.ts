import type { Config } from 'jest';
import nextJest from 'next/jest.js';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.test' });

const createJestConfig = nextJest({ dir: './' });

const sharedProjectConfig = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  clearMocks: true,
};

export default async (): Promise<Config> => {
  const unitConfig = await createJestConfig({
    ...sharedProjectConfig,
    displayName: 'unit',
    testMatch: ['<rootDir>/**/*.unit.test.[jt]s?(x)'],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    coveragePathIgnorePatterns: ['node_modules','/src/app/generated/prisma/'],
    testPathIgnorePatterns: ['/node_modules/', '/app/generated/prisma/'],
  })();

  const apiConfig = await createJestConfig({
    ...sharedProjectConfig,
    displayName: 'api',
    testMatch: ['<rootDir>/**/*.api.test.[jt]s?(x)'],
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.api.ts'],
    coveragePathIgnorePatterns: ['node_modules', '/src/app/generated/prisma/'],
    testPathIgnorePatterns: ['/node_modules/', '/app/generated/prisma/'],
  })();

  const integrationConfig = await createJestConfig({
    ...sharedProjectConfig,
    displayName: 'integration',
    testMatch: ['<rootDir>/**/*.integration.test.[jt]s?(x)'],
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.integration.ts'],
  })();

  return {
    // ✅ top-level only
    collectCoverage: true,
    coverageProvider: 'v8',
    coverageDirectory: 'coverage',
    reporters: ['default'],
   

    projects: [unitConfig, apiConfig, integrationConfig],
  };
};
