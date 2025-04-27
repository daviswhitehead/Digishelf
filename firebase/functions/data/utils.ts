import type { CheerioAPI } from 'cheerio';
import type { RatingMap } from './types.js';

/**
 * Translates a textual rating into a numerical star rating.
 */
export function translateRating(ratingText: string | undefined): number | null {
  // Translate "really liked it" to number of stars
  const ratingMap: RatingMap = {
    'did not like it': 1,
    'it was ok': 2,
    'liked it': 3,
    'really liked it': 4,
    'it was amazing': 5,
  };

  if (!ratingText) return null;

  const key = ratingText.toLowerCase() as keyof RatingMap;
  return ratingMap[key] || null;
}

/**
 * Removes newlines and extra spaces from a given string.
 */
export function cleanNewLines(s: string): string {
  // Remove newlines and extra spaces
  return s.replace(/\n\s+/g, ' ');
}

/**
 * Extracts the total number of pages from the pagination links.
 */
export function getTotalPages($: CheerioAPI): number {
  // #reviewPagination includes links like 1,2,3,...,14,"next »"
  // We want the last numeric link, ignoring rel="next".
  const lastPageLink = $('div#reviewPagination a:not([rel])').last().text().trim();
  // Convert to integer or default to 1 if not found
  const totalPages = parseInt(lastPageLink, 10) || 1;
  return totalPages;
}
