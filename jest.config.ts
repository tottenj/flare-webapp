import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const baseConfig: Config = {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/**/*.unit.test.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/__tests__/integration/**/*.test.ts'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.integration.ts'],
    },
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  clearMocks: true,
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports/jest', outputName: 'junit.xml' }],
  ],
};

export default createJestConfig(baseConfig);
