const axios = require('axios');
const cheerio = require('cheerio');
// const { getDominantColor } = require("../utils/getColors");
const pLimit = require('p-limit');

/**
 * Translates a textual rating into a numerical star rating.
 *
 * @param {string} ratingText - The textual representation of the rating.
 * @return {number|null} The numerical star rating corresponding to the given
 * text, or null if the text does not match any known rating.
 */
function translateRating(ratingText) {
  // Translate "really liked it" to number of stars
  const ratingMap = {
    'did not like it': 1,
    'it was ok': 2,
    'liked it': 3,
    'really liked it': 4,
    'it was amazing': 5,
  };

  return ratingText ? ratingMap[ratingText.toLowerCase()] : null;
}

/**
 * Removes newlines and extra spaces from a given string.
 *
 * @param {string} s - The string to be cleaned.
 * @return {string} - The cleaned string with newlines
 * and extra spaces removed.
 */
function cleanNewLines(s) {
  // Remove newlines and extra spaces
  return s.replace(/\n\s+/g, ' ');
}

/**
 * Extracts the total number of pages from the pagination links.
 *
 * @param {object} $ - The jQuery object used to select elements.
 * @return {number} The total number of pages. Defaults to 1 if no numeric link is found.
 */
function getTotalPages($) {
  // #reviewPagination includes links like 1,2,3,...,14,"next »"
  // We want the last numeric link, ignoring rel="next".
  const lastPageLink = $('#reviewPagination a:not([rel])').last().text().trim();
  // Convert to integer or default to 1 if not found
  const totalPages = parseInt(lastPageLink, 10) || 1;
  return totalPages;
}

/**
 * Scrapes a single Goodreads shelf page (for the given page number).
 *
 * @param {string} baseURL - The page baseURL.
 * @param {number} pageNumber - The page number.
 */
async function getPageItems(baseURL, pageNumber) {
  const label = `getPageItems-page-${pageNumber}`;
  console.time(label); // Use a unique label for each page
  try {
    const pageURL = baseURL + `&page=${pageNumber}`;
    const { data: html } = await axios.get(pageURL);
    const $ = cheerio.load(html);

    const bookRows = $('tr.bookalike.review').toArray();

    const limit = pLimit(5); // Limit to 5 concurrent requests

    const books = await Promise.all(
      bookRows.map(elem =>
        limit(async () => {
          let coverImage = $(elem).find('td.field.cover img').attr('src');
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
          const titleLink = $(elem).find('td.field.title a');
          const title = cleanNewLines(titleLink.text().trim());
          let canonicalURL = titleLink.attr('href');
          if (canonicalURL && !canonicalURL.startsWith('http')) {
            canonicalURL = 'https://www.goodreads.com' + canonicalURL;
          }

          // --- Author ---
          const author = $(elem).find('td.field.author a').first().text().trim();

          // --- Rating ---
          const rating =
            translateRating($(elem).find('td.field.rating span.staticStars').attr('title')) || null;

          // --- Review ---
          // Goodreads shows a preview in a span with an id starting "freeTextContainer"
          let review = $(elem).find('td.field.review span[id^=\'freeTextreview\']').text().trim();
          if (!review) {
            review = $(elem).find('td.field.review span[id^=\'freeTextContainer\']').text().trim();
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
 *
 * @param {string} originalURL - The URL for a shelf.
 * @return {object} allBooks - An array of books.
 */
async function getAllPages(originalURL) {
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
    console.error('Error:', error);
    console.timeEnd('getAllPages');
    return null;
  }
}

module.exports = {
  getAllPages,
};
