import * as cheerio from 'cheerio';
import { RATING_MAP } from './constants';

/**
 * Translates a textual rating into a numerical star rating.
 */
export function translateRating(ratingText: string | undefined): number | null {
  return ratingText ? RATING_MAP[ratingText.toLowerCase()] : null;
}

/**
 * Removes newlines and extra spaces from a string
 */
export function cleanNewLines(s: string): string {
  return s.replace(/\n\s+/g, ' ');
}

/**
 * Extracts the total number of pages from pagination
 */
export function getTotalPages($: cheerio.Root): number {
  const $pagination = $('#reviewPagination');
  if (!$pagination.length) {
    return 0;
  }

  const pageNumbers = $pagination
    .find('a')
    .map((_, el) => {
      const text = $(el).text().trim();
      const num = parseInt(text, 10);
      return isNaN(num) ? 0 : num;
    })
    .get();

  const maxPage = Math.max(...pageNumbers);
  if (maxPage > 0) {
    return maxPage;
  }

  // If no numeric pages found but there's a next button, assume we're on page 1
  return $pagination.find('a[rel="next"]').length ? 2 : 0;
}
