import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { readFileSync } from 'fs';
import { join } from 'path';

const FIXTURES_PATH = join(__dirname, '../../..', 'sources/goodreads/__tests__/__fixtures__/responses');

/**
 * Creates a mock for Goodreads API responses
 * @returns MockAdapter instance
 */
export function createGoodreadsMock(): MockAdapter {
  const mock = new MockAdapter(axios);
  return mock;
}

/**
 * Mocks a Goodreads shelf page response
 * @param mock - MockAdapter instance
 * @param userId - Goodreads user ID
 * @param shelfId - Shelf ID (e.g., 'currently-reading', 'read')
 * @param page - Page number
 * @param fixture - Fixture file name
 */
export function mockGoodreadsShelfPage(
  mock: MockAdapter,
  userId: string,
  shelfId: string,
  page: number = 1,
  fixture: string = 'currently_reading.html'
): void {
  const url = `https://www.goodreads.com/review/list/${userId}`;
  const html = readFileSync(join(FIXTURES_PATH, fixture), 'utf8');
  
  mock.onGet(url, { params: { shelf: shelfId, page } }).reply(200, html);
}

/**
 * Mocks a Goodreads error response
 * @param mock - MockAdapter instance
 * @param userId - Goodreads user ID
 * @param shelfId - Shelf ID
 * @param errorCode - HTTP error code
 */
export function mockGoodreadsError(
  mock: MockAdapter,
  userId: string,
  shelfId: string,
  errorCode: number = 404
): void {
  const url = `https://www.goodreads.com/review/list/${userId}`;
  mock.onGet(url, { params: { shelf: shelfId } }).reply(errorCode);
}

/**
 * Helper to reset all mocks
 * @param mock - MockAdapter instance
 */
export function resetMocks(mock: MockAdapter): void {
  mock.reset();
}

/**
 * Helper to restore axios to its original state
 * @param mock - MockAdapter instance
 */
export function restoreAxios(mock: MockAdapter): void {
  mock.restore();
} 