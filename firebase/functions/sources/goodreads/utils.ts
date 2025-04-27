import * as cheerio from 'cheerio';
import { RATING_MAP } from './constants.js';

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
  // First check for numeric page links
  const pageLinks = $('#reviewPagination a')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(text => /^\d+$/.test(text))
    .map(Number);

  if (pageLinks.length > 0) {
    return Math.max(...pageLinks);
  }

  // Check for next button
  const hasNextButton = $('a[rel="next"]').length > 0;
  if (hasNextButton) {
    return 2;
  }

  // Check for content
  const hasContent = $('.review').length > 0;
  return hasContent ? 1 : 0;
}
