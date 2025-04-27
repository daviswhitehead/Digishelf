import { getPageItems } from '../../data.js';
import { loadFixture } from '../helpers/loadFixture.js';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getPageItems', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('successfully fetches and parses a currently reading shelf', async () => {
    const mockHTML = loadFixture('responses/currently_reading.html');
    const baseURL = 'https://www.goodreads.com/review/list/123';
    const pageNumber = 1;
    mockedAxios.get.mockResolvedValue({ data: mockHTML });

    const result = await getPageItems(baseURL, pageNumber);

    expect(result).toBeDefined();
    expect(result.books).toHaveLength(7); // Currently reading shelf has 7 books

    // Verify first book (Wind and Truth)
    const firstBook = result.books[0];
    expect(firstBook).toMatchObject({
      title: 'Wind and Truth (The Stormlight Archive, #5)',
      author: 'Sanderson, Brandon',
      canonicalURL: expect.stringContaining('/book/show/203578847-wind-and-truth'),
      userRating: null, // Not rated yet
    });

    // Verify another book (Old Man's War)
    const secondBook = result.books[1];
    expect(secondBook).toMatchObject({
      title: "Old Man's War (Old Man's War, #1)",
      author: 'Scalzi, John',
      canonicalURL: expect.stringContaining('/book/show/36510196-old-man-s-war'),
      userRating: null, // Not rated yet
    });
  });

  it('successfully fetches and parses a read shelf', async () => {
    const mockHTML = loadFixture('responses/read_shelf.html');
    const baseURL = 'https://www.goodreads.com/review/list/123';
    const pageNumber = 1;
    mockedAxios.get.mockResolvedValue({ data: mockHTML });

    const result = await getPageItems(baseURL, pageNumber);

    expect(result).toBeDefined();
    expect(result.books.length).toBeGreaterThan(0);

    // Verify a rated book from the read shelf
    const ratedBook = result.books.find(book => book.userRating !== null && book.userRating > 0);
    expect(ratedBook).toBeDefined();
    if (ratedBook && ratedBook.userRating) {
      expect(ratedBook.userRating).toBeGreaterThan(0);
    }
  });

  it('handles empty shelf response', async () => {
    const mockHTML = loadFixture('responses/test_shelf.html');
    const baseURL = 'https://www.goodreads.com/review/list/123';
    const pageNumber = 1;
    mockedAxios.get.mockResolvedValue({ data: mockHTML });

    const result = await getPageItems(baseURL, pageNumber);

    expect(result).toBeDefined();
    expect(result.books).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(`No books found on page ${pageNumber}`);
  });
});
