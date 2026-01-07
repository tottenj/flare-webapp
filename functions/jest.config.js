/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  clearMocks: true,
  restoreMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  reporters: ['default'],
};
