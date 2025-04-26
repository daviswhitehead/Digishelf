import cheerio from 'cheerio';
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
export function getTotalPages($: cheerio.CheerioAPI): number {
  const lastPageLink = $('#reviewPagination a:not([rel])').last().text().trim();
  return parseInt(lastPageLink, 10) || 1;
} 