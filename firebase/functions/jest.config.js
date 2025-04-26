/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Add specific configuration for test teardown
  setupFilesAfterEnv: ['./jest.setup.js'],
  // Set a timeout for test teardown
  testTimeout: 10000,
  // Force exit after all tests complete
  forceExit: true,
  // Detect open handles
  detectOpenHandles: true,
  collectCoverageFrom: [
    '*.{js,ts}',
    'handlers/**/*.{js,ts}',
    'data/**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}; 