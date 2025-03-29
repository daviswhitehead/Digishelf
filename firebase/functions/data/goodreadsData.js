const axios = require("axios");
const cheerio = require("cheerio");
// const { writeHTML } = require("../utils/writeHTML");

// TO DO
// Get the primary color of each coverImage

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
    "did not like it": 1,
    "it was ok": 2,
    "liked it": 3,
    "really liked it": 4,
    "it was amazing": 5,
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
  return s.replace(/\n\s+/g, " ");
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
  const lastPageLink = $("#reviewPagination a:not([rel])").last().text().trim();
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
  // Construct the pageURL with the appropriate page parameter.
  const pageURL = baseURL + `&page=${pageNumber}`;
  const { data: html } = await axios.get(pageURL);
  const $ = cheerio.load(html);
  // writeHTML(html);

  const books = [];
  // Loop through each book review on the page
  $("tr.bookalike.review").each((i, elem) => {
    // --- Cover image ---
    let coverImage = $(elem).find("td.field.cover img").attr("src");
    // Remove the size specifier to get a larger image.
    // (like ._SY75_ or ._SX50_)
    if (coverImage) {
      coverImage = coverImage.replace(/\._S[XY]\d+_/, "");
    }

    // --- Title & details URL ---
    const titleLink = $(elem).find("td.field.title a");
    const title = cleanNewLines(titleLink.text().trim());
    let detailsURL = titleLink.attr("href");
    if (detailsURL && !detailsURL.startsWith("http")) {
      detailsURL = "https://www.goodreads.com" + detailsURL;
    }

    // --- Author ---
    const author = $(elem).find("td.field.author a").first().text().trim();

    // --- Rating ---
    const rating =
      translateRating(
        $(elem).find("td.field.rating span.staticStars").attr("title")
      ) || null;

    // --- Review ---
    // Goodreads shows a preview in a span with an id starting "freeTextContainer"
    let review = $(elem)
      .find("td.field.review span[id^='freeTextreview']")
      .text()
      .trim();
    if (!review) {
      review = $(elem)
        .find("td.field.review span[id^='freeTextContainer']")
        .text()
        .trim();
    }
    books.push({
      title,
      author,
      coverImage,
      URL: detailsURL,
      userRating: rating,
      userReview: cleanNewLines(review),
    });
  });

  return { books, $ };
}

/**
 * Gets all pages of a Goodreads shelf and returns all books.
 *
 * @param {string} shelfURL - The URL for a shelf.
 * @return {object} allBooks - An array of books.
 */
async function getAllPages(shelfURL) {
  try {
    // 1) Fetch Page 1
    const { books: booksOnPage1, $ } = await getPageItems(shelfURL, 1);
    console.log(`Found ${booksOnPage1} on page 1`);
    // 2) Determine total pages
    const totalPages = getTotalPages($);
    console.log(`Total pages: ${totalPages}`);
    let allBooks = [...booksOnPage1];

    // 3) Scrape the rest
    for (let page = 2; page <= totalPages; page++) {
      const { books } = await getPageItems(shelfURL, page);
      console.log(`Found ${books.length} on page ${page}`);
      allBooks = allBooks.concat(books);

      // 1-second delay to reduce chance of rate-limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return allBooks;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

module.exports = {
  getAllPages,
};
