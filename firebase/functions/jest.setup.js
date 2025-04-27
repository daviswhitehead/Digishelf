/* global jest, afterEach, afterAll */

const { resetDb } = require('./__tests__/test-utils');

// Increase the default timeout
jest.setTimeout(30000);

// Ensure cleanup after each test
afterEach(async () => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Force cleanup after all tests
afterAll(async () => {
  await resetDb();
  jest.clearAllMocks();
  jest.clearAllTimers();
});
