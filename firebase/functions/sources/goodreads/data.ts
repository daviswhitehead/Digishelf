import * as cheerio from 'cheerio';
import axios, { AxiosError } from 'axios';
import { withTiming } from '../../shared/utils/timing.js';
import { retry } from '../../shared/utils/retry.js';
import { GoodreadsBook } from './types.js';
import { translateRating, cleanNewLines, getTotalPages } from './utils.js';
import pLimit from 'p-limit';
import { CONCURRENCY } from './constants.js';
import { Element } from 'domhandler';

/**
 * Extracts review text from a Goodreads review element using multiple possible selectors
 */
export function extractReviewText($: cheerio.CheerioAPI, elem: Element): string {
  const $elem = $(elem);
  // Try to find the review text in various possible locations
  const reviewSelectors = ['span[id^="freeTextreview"]', 'span[id^="freeText"]', '.field.review'];

  for (const selector of reviewSelectors) {
    const reviewText = $elem.find(selector).text().trim();
    if (reviewText) {
      // Normalize whitespace: replace multiple spaces/newlines with a single space
      return reviewText.replace(/\s+/g, ' ').trim();
    }
  }

  // If no review text is found in any of the expected locations, return empty string
  return '';
}

/**
 * Parses a single book row from Goodreads HTML
 */
export function parseBookRow($: cheerio.CheerioAPI, elem: Element): GoodreadsBook {
  const $elem = $(elem);

  // Cover Image
  let coverImage = $elem.find('td.field.cover img').attr('src') || '';
  if (coverImage) {
    coverImage = coverImage.replace(/\._S[XY]\d+_/, '');
  }

  // Title and URL
  const titleElem = $elem.find('td.field.title a');
  const title = cleanNewLines(titleElem.text().trim());
  let canonicalURL = titleElem.attr('href') || '';
  if (canonicalURL && !canonicalURL.startsWith('http')) {
    canonicalURL = 'https://www.goodreads.com' + canonicalURL;
  }

  // Author
  const authorElem = $elem.find('td.field.author a');
  const author = authorElem.text().trim();

  // Rating and Review
  const ratingTitle = $elem.find('td.field.rating span.staticStars').attr('title');
  const rating = translateRating(ratingTitle);
  const userReview = extractReviewText($, elem);

  return {
    title,
    author,
    coverImage,
    canonicalURL,
    userRating: rating,
    userReview,
    primaryColor: '',
  };
}

interface PageData {
  books: GoodreadsBook[];
  $: cheerio.CheerioAPI;
}

/**
 * Scrapes a single Goodreads shelf page with retry logic
 */
export async function getPageItems(baseURL: string, pageNumber: number): Promise<PageData> {
  return withTiming(`getPageItems-page-${pageNumber}`, async () => {
    try {
      const pageURL = baseURL + `&page=${pageNumber}`;

      // Fetch HTML with retry logic
      const response = await retry(() => axios.get(pageURL), {
        retries: 3,
        minTimeout: 1000,
        factor: 2,
        onRetry: (error: Error) => {
          console.warn(
            `Retrying page ${pageNumber} after error:`,
            error instanceof AxiosError ? error.message : 'Unknown error'
          );
        },
      });

      // Load HTML with cheerio
      const $ = cheerio.load(response.data) as cheerio.CheerioAPI;

      const bookRows = $('tr.bookalike.review').toArray();

      if (!bookRows.length) {
        console.warn(`No books found on page ${pageNumber}`);
      }

      const limit = pLimit(CONCURRENCY.PAGE_REQUESTS);
      const books = await Promise.all(
        bookRows.map(elem => limit(async () => parseBookRow($, elem as unknown as Element)))
      );

      return { books, $ };
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response
          ? `HTTP ${error.response.status}: ${error.message}`
          : error instanceof Error
            ? error.message
            : 'Unknown error';

      console.error(`Failed to fetch page ${pageNumber}:`, errorMessage);
      throw error;
    }
  });
}

/**
 * Gets all pages of a Goodreads shelf with parallel processing and error handling
 */
export async function getAllPages(originalURL: string): Promise<GoodreadsBook[] | null> {
  return withTiming('getAllPages', async () => {
    try {
      // Fetch first page to get total pages
      const firstPageResult = await getPageItems(originalURL, 1).catch(error => {
        const errorMessage =
          error instanceof AxiosError && error.response
            ? `HTTP ${error.response.status}: ${error.message}`
            : error instanceof Error
              ? error.message
              : 'Unknown error';

        console.error('Failed to fetch page 1:', errorMessage);
        throw error;
      });

      if (!firstPageResult) {
        return null;
      }

      const { books: booksOnPage1, $ } = firstPageResult;
      console.info(`Found ${booksOnPage1.length} books on page 1`);

      const totalPages = getTotalPages($);
      console.info(`Total pages to process: ${totalPages}`);
      let allBooks = [...booksOnPage1];

      if (totalPages > 1) {
        const limit = pLimit(CONCURRENCY.PAGE_REQUESTS);
        const pagePromises = Array.from({ length: totalPages - 1 }, (_, i) =>
          limit(() => getPageItems(originalURL, i + 2))
        );

        const results = await Promise.allSettled(pagePromises);
        let successCount = 1; // Count first page as success
        let failureCount = 0;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const { books } = result.value;
            console.info(`Found ${books.length} books on page ${index + 2}`);
            allBooks = allBooks.concat(books);
            successCount++;
          } else {
            console.error(
              `Failed to fetch page ${index + 2} (${originalURL}&page=${index + 2}):`,
              result.reason instanceof Error ? result.reason.message : 'Unknown error'
            );
            failureCount++;
          }
        });

        console.info(`Completed processing ${successCount}/${totalPages} pages successfully`);
        if (failureCount > 0) {
          console.warn(`Failed to process ${failureCount} pages`);
        }
      }

      if (!allBooks.length) {
        console.warn('No books found in shelf');
        return []; // Return empty array for no books
      }

      console.info(`Total books collected: ${allBooks.length}`);
      return allBooks;
    } catch (error) {
      return null; // Return null for errors
    }
  }) as Promise<GoodreadsBook[] | null>;
}
