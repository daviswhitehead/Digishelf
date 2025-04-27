import { cleanup } from './test/helpers/test-utils';
import './test/helpers/jest.setup';

// Increase the default timeout
jest.setTimeout(30000);

// Ensure cleanup after each test
afterEach(async () => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Force cleanup after all tests
afterAll(async () => {
  await cleanup();
  jest.clearAllMocks();
  jest.clearAllTimers();
}); 