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
export function getTotalPages($: ReturnType<typeof cheerio.load>): number {
  // First check for numeric page links
  const pageLinks = $('#reviewPagination a')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(text => /^\d+$/.test(text))
    .map(Number);

  // Check for next button
  const hasNextButton = $('#reviewPagination a[rel="next"]').length > 0;

  if (pageLinks.length > 0) {
    const maxNumericPage = Math.max(...pageLinks);
    // If there's also a next button, there are more pages after the last numeric link
    return hasNextButton ? maxNumericPage + 1 : maxNumericPage;
  }

  // If there's a next button but no numeric links, there must be at least 2 pages
  if (hasNextButton) {
    return 2;
  }

  // Check for content
  const hasContent = $('.review').length > 0;
  if (!hasContent) {
    return 0;
  }

  // If there's content but no pagination or next button, it's a single page
  return 1;
}
