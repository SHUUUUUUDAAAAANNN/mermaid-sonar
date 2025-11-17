/**
 * Jest configuration for integration tests
 * Uses real dependencies instead of mocks
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['**/cli.integration.test.ts'], // Only run CLI integration tests
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/*.test.ts'],
  testTimeout: 30000, // Integration tests may take longer
};
