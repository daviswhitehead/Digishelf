import { getAllPages } from '../data';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { loadFixture } from './__fixtures__/loadFixture';

describe('getAllPages', () => {
  let mock: MockAdapter;
  
  beforeEach(() => {
    mock = new MockAdapter(axios);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  it('successfully fetches a single page shelf', async () => {
    const mockHTML = loadFixture('responses/currently_reading.html');
    const baseURL = 'https://www.goodreads.com/review/list/123';
    mock.onGet(`${baseURL}&page=1`).reply(200, mockHTML);

    const result = await getAllPages(baseURL);

    expect(result).toBeDefined();
    expect(result?.length).toBe(7); // Currently reading shelf has 7 books
    expect(result?.[0]).toMatchObject({
      title: 'Wind and Truth (The Stormlight Archive, #5)',
      author: 'Sanderson, Brandon',
    });
  });

  it('handles empty shelf response', async () => {
    const mockHTML = loadFixture('responses/test_shelf.html');
    const baseURL = 'https://www.goodreads.com/review/list/123';
    mock.onGet(`${baseURL}&page=1`).reply(200, mockHTML);

    const result = await getAllPages(baseURL);

    expect(result).toBeDefined();
    expect(result).toEqual([]);
    expect(console.info).toHaveBeenCalledWith('Found 0 books on page 1');
  });

  it('handles network errors gracefully', async () => {
    const baseURL = 'https://www.goodreads.com/review/list/123';
    mock.onGet(`${baseURL}&page=1`).networkError();

    const result = await getAllPages(baseURL);
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('handles rate limiting', async () => {
    const baseURL = 'https://www.goodreads.com/review/list/123';
    mock.onGet(`${baseURL}&page=1`).reply(429);

    const result = await getAllPages(baseURL);
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch page 1:',
      expect.stringContaining('429')
    );
  });
}); 