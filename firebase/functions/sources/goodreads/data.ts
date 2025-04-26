import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoodreadsBook, GoodreadsShelfData } from './types';
import { withTiming } from '../../shared/utils/timing';
import { limit } from '../../shared/utils/promise';

const reviewSelectors = ['span[id^="freeTextreview"]', 'span[id^="freeText"]', '.field.review'];

/**
 * Extracts review text from a Goodreads review element using multiple possible selectors
 */
export function extractReviewText($elem: cheerio.Cheerio): string {
  for (const selector of reviewSelectors) {
    const reviewText = $elem.find(selector).text().trim();
    if (reviewText) {
      return reviewText.replace(/\s+/g, ' ');
    }
  }
  return '';
}

/**
 * Parses a single book row from Goodreads HTML
 */
export function parseBookRow($: cheerio.Root, $row: cheerio.Cheerio): GoodreadsBook {
  const title = $row.find('td.field.title a').text().trim();
  const author = $row.find('td.field.author a').text().trim();
  const coverImg = $row.find('td.field.cover img').attr('src') || '';
  const isbn = $row.find('td.field.isbn').text().trim();
  const avgRating = parseFloat($row.find('td.field.avg_rating').text().trim()) || 0;
  const dateAdded = $row.find('td.field.date_added').text().trim();
  const review = extractReviewText($row);
  const userRating =
    parseFloat($row.find('td.field.rating span.staticStars').attr('title')?.split(' ')[0] || '0') ||
    0;

  return {
    title,
    author,
    coverImg,
    isbn,
    avgRating,
    dateAdded,
    review,
    userRating,
  };
}

/**
 * Scrapes a single Goodreads shelf page with retry logic
 */
export async function getPageItems(url: string, pageNumber: number): Promise<GoodreadsShelfData> {
  const pageUrl = pageNumber > 1 ? `${url}?page=${pageNumber}` : url;

  return withTiming(`getPageItems-page-${pageNumber}`, async () => {
    const response = await axios.get(pageUrl);
    const $ = cheerio.load(response.data);
    const bookRows = $('tr.review').toArray();

    const books = await Promise.all(
      bookRows.map(elem => limit(async () => parseBookRow($, $(elem))))
    );

    return {
      shelfId: '', // These will be filled in by the caller
      userId: '',
      sourceId: '',
      integrationId: '',
      books,
      totalBooks: books.length,
      lastRefreshed: new Date().toISOString(),
      $,
    };
  });
}
