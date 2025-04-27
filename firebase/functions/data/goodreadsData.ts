import axios from 'axios';
import { load } from 'cheerio';
import type { GoodreadsBook, PageResult } from '../shared/types/goodreads.js';
import { CONCURRENCY } from '../shared/constants/goodreads.js';
import { translateRating, cleanNewLines, getTotalPages } from './utils.js';
import pLimit from 'p-limit';

/**
 * Scrapes a single Goodreads shelf page (for the given page number).
 */
async function getPageItems(baseURL: string, pageNumber: number): Promise<PageResult> {
  const label = `getPageItems-page-${pageNumber}`;
  console.time(label);
  try {
    const pageURL = baseURL + `&page=${pageNumber}`;
    const { data: html } = await axios.get<string>(pageURL);
    const $ = load(html);

    const bookRows = $('tr.bookalike.review').toArray();

    const limit = pLimit(CONCURRENCY.BOOK_PROCESSING);

    const books = await Promise.all(
      bookRows.map(elem =>
        limit(async () => {
          const $elem = $(elem);
          let coverImage = $elem.find('td.field.cover img').attr('src') || null;
          const primaryColor = null;

          if (coverImage) {
            coverImage = coverImage.replace(/\._S[XY]\d+_/, '');
          }

          const titleLink = $elem.find('td.field.title a');
          const title = cleanNewLines(titleLink.text().trim());
          let canonicalURL = titleLink.attr('href') || null;
          if (canonicalURL && !canonicalURL.startsWith('http')) {
            canonicalURL = 'https://www.goodreads.com' + canonicalURL;
          }

          const author = $elem.find('td.field.author a').first().text().trim();
          const userRating = translateRating(
            $elem.find('td.field.rating span.staticStars').attr('title')
          );

          let review = $elem.find("td.field.review span[id^='freeTextreview']").text().trim();
          if (!review) {
            review = $elem.find("td.field.review span[id^='freeTextContainer']").text().trim();
          }

          return {
            title,
            author,
            coverImage,
            canonicalURL,
            userRating,
            userReview: cleanNewLines(review),
            primaryColor,
          };
        })
      )
    );

    console.timeEnd(label);
    return { books, $ };
  } catch (error) {
    console.timeEnd(label);
    throw error;
  }
}

/**
 * Gets all pages of a Goodreads shelf and returns all books.
 */
async function getAllPages(originalURL: string): Promise<GoodreadsBook[] | null> {
  try {
    console.time('getAllPages');
    const { books: booksOnPage1, $ } = await getPageItems(originalURL, 1);
    console.info(`Found ${booksOnPage1.length} on page 1`);

    const totalPages = getTotalPages($);
    console.info(`Total pages: ${totalPages}`);
    let allBooks = [...booksOnPage1];

    if (totalPages > 1) {
      const limit = pLimit(CONCURRENCY.PAGE_REQUESTS);
      const pagePromises = [];
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(limit(() => getPageItems(originalURL, page)));
      }

      const results = await Promise.allSettled(pagePromises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { books } = result.value;
          console.info(`Found ${books.length} on page ${index + 2}`);
          allBooks = allBooks.concat(books);
        } else {
          console.error(
            `Failed to fetch page ${index + 2} (${originalURL}&page=${index + 2}):`,
            result.reason
          );
        }
      });
    }

    console.timeEnd('getAllPages');
    return allBooks;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    console.timeEnd('getAllPages');
    return null;
  }
}

export { getAllPages, type GoodreadsBook };
