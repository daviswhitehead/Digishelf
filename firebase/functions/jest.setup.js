// Increase the default timeout
jest.setTimeout(10000);

// Ensure cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Force cleanup after all tests
afterAll(done => {
  // Clear any remaining timers
  jest.clearAllTimers();
  // Clear any remaining mocks
  jest.clearAllMocks();
  done();
}); 