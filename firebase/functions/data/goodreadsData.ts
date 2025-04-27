import axios from 'axios';
import cheerio from 'cheerio';
import pLimit from 'p-limit';
// import { getDominantColor } from '../utils/getColors';

interface GoodreadsBook {
  title: string;
  author: string;
  coverImage: string | null;
  canonicalURL: string | null;
  userRating: number | null;
  userReview: string;
  primaryColor: string | null;
}

type RatingMap = {
  'did not like it': 1;
  'it was ok': 2;
  'liked it': 3;
  'really liked it': 4;
  'it was amazing': 5;
};

/**
 * Translates a textual rating into a numerical star rating.
 */
function translateRating(ratingText: string | undefined): number | null {
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
function cleanNewLines(s: string): string {
  // Remove newlines and extra spaces
  return s.replace(/\n\s+/g, ' ');
}

/**
 * Extracts the total number of pages from the pagination links.
 */
function getTotalPages($: cheerio.CheerioAPI): number {
  // #reviewPagination includes links like 1,2,3,...,14,"next »"
  // We want the last numeric link, ignoring rel="next".
  const lastPageLink = $('div#reviewPagination a:not([rel])').last().text().trim();
  // Convert to integer or default to 1 if not found
  const totalPages = parseInt(lastPageLink, 10) || 1;
  return totalPages;
}

interface PageResult {
  books: GoodreadsBook[];
  $: cheerio.CheerioAPI;
}

/**
 * Scrapes a single Goodreads shelf page (for the given page number).
 */
async function getPageItems(baseURL: string, pageNumber: number): Promise<PageResult> {
  const label = `getPageItems-page-${pageNumber}`;
  console.time(label); // Use a unique label for each page
  try {
    const pageURL = baseURL + `&page=${pageNumber}`;
    const { data: html } = await axios.get<string>(pageURL);
    const $ = cheerio.load(html);

    const bookRows = $('tr.bookalike.review').toArray();

    const limit = pLimit(5); // Limit to 5 concurrent requests

    const books = await Promise.all(
      bookRows.map(elem =>
        limit(async () => {
          const $elem = $(elem);
          let coverImage = $elem.find('td.field.cover img').attr('src') || null;
          const primaryColor = null;

          if (coverImage) {
            coverImage = coverImage.replace(/\._S[XY]\d+_/, ''); // Remove size specifier
            // try {
            //   primaryColor = await getDominantColor(coverImage);
            // } catch (error) {
            //   console.error(
            //     `Failed to process color for ${coverImage}:`,
            //     error.message
            //   );
            // }
          }

          // --- Title & Canonical URL ---
          const titleLink = $elem.find('td.field.title a');
          const title = cleanNewLines(titleLink.text().trim());
          let canonicalURL = titleLink.attr('href') || null;
          if (canonicalURL && !canonicalURL.startsWith('http')) {
            canonicalURL = 'https://www.goodreads.com' + canonicalURL;
          }

          // --- Author ---
          const author = $elem.find('td.field.author a').first().text().trim();

          // --- Rating ---
          const rating = translateRating($elem.find('td.field.rating span.staticStars').attr('title'));

          // --- Review ---
          // Goodreads shows a preview in a span with an id starting "freeTextContainer"
          let review = $elem.find('td.field.review span[id^=\'freeTextreview\']').text().trim();
          if (!review) {
            review = $elem.find('td.field.review span[id^=\'freeTextContainer\']').text().trim();
          }

          return {
            title,
            author,
            coverImage,
            canonicalURL,
            userRating: rating,
            userReview: cleanNewLines(review),
            primaryColor,
          };
        })
      )
    );

    console.timeEnd(label); // End timing for this page
    return { books, $ };
  } catch (error) {
    console.timeEnd(label); // Ensure timing ends even on error
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
      const limit = pLimit(5); // Limit to 5 concurrent requests
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