import { jest } from '@jest/globals';
import axios from 'axios';
import cheerio from 'cheerio';
import { createMockBook, mockGoodreadsResponse } from './mocks';
import { getAllPages } from '../data';
import { GoodreadsBook } from '../types';
import type { Mock } from 'jest-mock';

// Define types for our mock functions
type CheerioMock = {
  find?: Mock;
  text?: () => string;
  attr?: (attr: string) => string;
  toArray?: () => any[];
  length?: number;
};

type MockFunction = (...args: any[]) => any;

jest.mock('axios');
jest.mock('cheerio');

describe('getAllPages', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;
  const mockCheerio = cheerio as unknown as jest.Mock<MockFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and parses books from a single page', async () => {
    const mockBooks = [
      createMockBook(),
      createMockBook({ title: 'Book 2', author: 'Author 2' })
    ];
    const mockHtml = mockGoodreadsResponse(mockBooks);

    mockAxios.get.mockResolvedValueOnce({ data: mockHtml });

    // Mock cheerio chain for book rows
    mockCheerio.mockReturnValue({
      find: jest.fn<MockFunction>().mockReturnValue({
        toArray: jest.fn().mockReturnValue(mockBooks.map((book) => ({
          find: jest.fn<MockFunction>().mockImplementation((selector: string): CheerioMock => {
            switch (selector) {
              case 'td.field.cover img':
                return { attr: () => book.coverImage };
              case 'td.field.title a':
                return {
                  text: () => book.title,
                  attr: () => book.canonicalURL
                };
              case 'td.field.author a':
                return { text: () => book.author };
              case 'td.field.rating span.staticStars':
                return { attr: () => book.userRating ? 'really liked it' : '' };
              case 'td.field.review':
                return {
                  find: jest.fn().mockReturnValue({
                    text: () => book.userReview
                  })
                };
              default:
                return { text: () => '', attr: () => '' };
            }
          })
        })))
      })
    });

    const result = await getAllPages('https://goodreads.com/shelf/1');

    expect(mockAxios.get).toHaveBeenCalledWith('https://goodreads.com/shelf/1&page=1');
    expect(mockCheerio).toHaveBeenCalledWith(mockHtml);
    expect(result).toHaveLength(mockBooks.length);
    expect(result![0]).toEqual(expect.objectContaining({
      title: mockBooks[0].title,
      author: mockBooks[0].author,
      canonicalURL: mockBooks[0].canonicalURL,
      coverImage: mockBooks[0].coverImage,
      userRating: mockBooks[0].userRating,
      userReview: mockBooks[0].userReview
    }));
  });

  it('handles empty shelves', async () => {
    const mockHtml = mockGoodreadsResponse([]);
    mockAxios.get.mockResolvedValueOnce({ data: mockHtml });
    mockCheerio.mockReturnValue({
      find: jest.fn<MockFunction>().mockReturnValue({
        toArray: jest.fn().mockReturnValue([])
      })
    });

    const result = await getAllPages('https://goodreads.com/shelf/1');
    expect(result).toBeNull();
  });

  it('fetches multiple pages', async () => {
    const page1Books = [createMockBook({ title: 'Book 1' })];
    const page2Books = [createMockBook({ title: 'Book 2' })];
    
    // Mock first page with pagination
    mockAxios.get.mockResolvedValueOnce({
      data: mockGoodreadsResponse(page1Books, { totalPages: 2 })
    });
    
    // Mock second page
    mockAxios.get.mockResolvedValueOnce({
      data: mockGoodreadsResponse(page2Books)
    });

    // Mock cheerio for both pages
    const createBookMock = (book: GoodreadsBook): CheerioMock => ({
      find: jest.fn<MockFunction>().mockImplementation((selector: string): CheerioMock => {
        switch (selector) {
          case 'td.field.cover img':
            return { attr: () => book.coverImage };
          case 'td.field.title a':
            return {
              text: () => book.title,
              attr: () => book.canonicalURL
            };
          case 'td.field.author a':
            return { text: () => book.author };
          case 'td.field.rating span.staticStars':
            return { attr: () => book.userRating ? 'really liked it' : '' };
          case 'td.field.review':
            return {
              find: jest.fn().mockReturnValue({
                text: () => book.userReview
              })
            };
          default:
            return { text: () => '', attr: () => '' };
        }
      })
    });

    mockCheerio.mockImplementation((html: string) => ({
      find: jest.fn<MockFunction>().mockImplementation((selector: string) => {
        if (selector === '#reviewPagination') {
          return {
            find: jest.fn().mockReturnValue({
              length: 2 // Indicates 2 pages
            })
          };
        }
        return {
          toArray: jest.fn().mockReturnValue(
            (html.includes('Book 1') ? page1Books : page2Books).map(createBookMock)
          )
        };
      })
    }));

    const result = await getAllPages('https://goodreads.com/shelf/1');

    expect(mockAxios.get).toHaveBeenCalledTimes(2);
    expect(mockAxios.get).toHaveBeenCalledWith('https://goodreads.com/shelf/1&page=1');
    expect(mockAxios.get).toHaveBeenCalledWith('https://goodreads.com/shelf/1&page=2');
    expect(result).toHaveLength(2);
    expect(result![0].title).toBe('Book 1');
    expect(result![1].title).toBe('Book 2');
  });

  it('handles network errors gracefully', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const result = await getAllPages('https://goodreads.com/shelf/1');
    expect(result).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
  });
}); 