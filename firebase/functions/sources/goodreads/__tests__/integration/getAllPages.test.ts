import { getAllPages } from '../../data.js';
import { loadFixture } from '../helpers/loadFixture.js';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { retry } from '../../../../shared/utils/retry.js';

// Mock retry utility to pass through the promise
jest.mock('../../../../shared/utils/retry.js', () => ({
  retry: jest.fn(async fn => fn()),
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getAllPages', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});

    // Reset retry mock for each test
    (retry as jest.Mock).mockImplementation(async fn => fn());
  });

  it('successfully fetches a single page shelf', async () => {
    const mockHTML = loadFixture('responses/currently_reading.html');
    const baseURL = 'https://www.goodreads.com/review/list/123';
    mockedAxios.get.mockResolvedValue({ data: mockHTML });

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
    mockedAxios.get.mockResolvedValue({ data: mockHTML });

    const result = await getAllPages(baseURL);

    expect(result).toBeDefined();
    expect(result).toEqual([]);
    expect(console.info).toHaveBeenCalledWith('Found 0 books on page 1');
  });

  it('handles network errors gracefully', async () => {
    const baseURL = 'https://www.goodreads.com/review/list/123';
    const networkError = new Error('Network Error');
    mockedAxios.get.mockRejectedValue(networkError);

    const result = await getAllPages(baseURL);
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Failed to fetch page 1:', 'Network Error');
  });

  it('handles rate limiting', async () => {
    const baseURL = 'https://www.goodreads.com/review/list/123';

    // Create a proper Axios error response
    const error = new AxiosError();
    error.response = {
      status: 429,
      statusText: 'Too Many Requests',
      headers: {},
      config: {
        headers: {},
      } as InternalAxiosRequestConfig,
      data: 'Too Many Requests',
    };
    error.message = 'Request failed with status code 429';

    mockedAxios.get.mockRejectedValue(error);

    const result = await getAllPages(baseURL);
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch page 1:',
      'HTTP 429: Request failed with status code 429'
    );
  });
});
