import axios, { AxiosError } from 'axios';
import cheerio, { CheerioAPI, Cheerio } from 'cheerio';
import { Element } from 'domhandler';
import { withTiming } from '../../shared/utils/timing';
import { retry } from '../../shared/utils/retry';
import { GoodreadsBook } from './types';
import { translateRating, cleanNewLines, getTotalPages } from './utils';
import pLimit from 'p-limit';
import { CONCURRENCY } from './constants';
import { PageResult } from './types';

/**
 * Extracts review text from a Goodreads review element using multiple possible selectors
 */
export function extractReviewText($elem: Cheerio<Element>): string {
  // Try each selector in order
  const selectors = [
    'span[id^="freeTextreview"]',
    'span[id^="freeText"]',
    '.field.review'
  ];

  let text = '';

  // First try finding within the element
  for (const selector of selectors) {
    const found = $elem.find(selector);
    if (found.length > 0) {
      text = found.text().trim();
      if (text) return text;
    }
  }

  // If no matches found in children, try the element itself
  text = $elem.text().trim();
  return text;
}

/**
 * Parses a single book row from Goodreads HTML
 */
function parseBookRow($: CheerioAPI, elem: Element): GoodreadsBook {
  // Cover Image
  let coverImage = $(elem).find('td.field.cover img').attr('src') || '';
  if (coverImage) {
    coverImage = coverImage.replace(/\._S[XY]\d+_/, '');
  }

  // Title and URL
  const titleLink = $(elem).find('td.field.title a');
  const title = cleanNewLines(titleLink.text().trim());
  let canonicalURL = titleLink.attr('href') || '';
  if (canonicalURL && !canonicalURL.startsWith('http')) {
    canonicalURL = 'https://www.goodreads.com' + canonicalURL;
  }

  // Author
  const author = $(elem)
    .find('td.field.author a')
    .first()
    .text()
    .trim();

  // Rating and Review
  const rating = translateRating(
    $(elem).find('td.field.rating span.staticStars').attr('title')
  );
  const userReview = extractReviewText($(elem));

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

/**
 * Scrapes a single Goodreads shelf page with retry logic
 */
async function getPageItems(baseURL: string, pageNumber: number): Promise<PageResult> {
  return withTiming(`getPageItems-page-${pageNumber}`, async () => {
    try {
      const pageURL = baseURL + `&page=${pageNumber}`;
      
      // Fetch HTML with retry logic
      const { data: html } = await retry(
        () => axios.get(pageURL),
        {
          retries: 3,
          minTimeout: 1000,
          factor: 2,
          onRetry: (error: Error) => {
            console.warn(
              `Retrying page ${pageNumber} after error:`,
              error instanceof AxiosError ? error.message : 'Unknown error'
            );
          }
        }
      );

      const $ = cheerio.load(html);
      const bookRows = $('tr.bookalike.review').toArray();
      
      if (!bookRows.length) {
        console.warn(`No books found on page ${pageNumber}`);
      }

      const limit = pLimit(CONCURRENCY.PAGE_REQUESTS);
      const books = await Promise.all(
        bookRows.map((elem) =>
          limit(async () => parseBookRow($, elem))
        )
      );

      return { books, $ };
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? `HTTP ${error.response?.status}: ${error.message}`
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
      const { books: booksOnPage1, $ } = await getPageItems(originalURL, 1);
      console.info(`Found ${booksOnPage1.length} books on page 1`);

      const totalPages = getTotalPages($);
      console.info(`Total pages to process: ${totalPages}`);
      let allBooks = [...booksOnPage1];

      if (totalPages > 1) {
        const limit = pLimit(CONCURRENCY.PAGE_REQUESTS);
        const pagePromises = Array.from(
          { length: totalPages - 1 },
          (_, i) => limit(() => getPageItems(originalURL, i + 2))
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
        return null;
      }

      console.info(`Total books collected: ${allBooks.length}`);
      return allBooks;
    } catch (error) {
      console.error('Fatal error in getAllPages:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }) as Promise<GoodreadsBook[] | null>; // Type assertion to fix return type
}