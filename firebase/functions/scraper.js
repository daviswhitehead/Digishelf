const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(); // uses default credentials in Cloud Functions
const axios = require("axios");
const cheerio = require("cheerio");
// const fs = require("fs");
// const path = require("path");

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
 * Writes the provided HTML content to a file in the current directory.
 *
 * @param {string} html - The HTML content to be written to the file.
 */
// function writeHTML(html) {
//   const filePath = path.join(__dirname, "goodreads.html");

//   fs.writeFileSync(filePath, html, "utf8");
//   console.log(`HTML saved to ${filePath}`);
// }

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
 * @param {number} pageNumber - The page number.
 */
async function scrapeGoodreadsPage(pageNumber) {
  // Construct the URL with the appropriate page parameter.
  const url = `https://www.goodreads.com/review/list/61851004-davis-whitehead?page=${pageNumber}&shelf=read`;
  const { data: html } = await axios.get(url);
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
      coverImage,
      title,
      author,
      detailsURL,
      rating,
      review: cleanNewLines(review),
    });
  });

  return { books, $ };
}

/**
 * Firebase Cloud Function to scrape all pages and return all books.
 */
exports.getGoodreadsShelf = functions.https.onRequest(async (req, res) => {
  try {
    // 1) Fetch Page 1
    const { books: booksOnPage1, $ } = await scrapeGoodreadsPage(1);
    console.log(`Found ${booksOnPage1} on page 1`);
    // 2) Determine total pages
    const totalPages = getTotalPages($);
    console.log(`Total pages: ${totalPages}`);
    let allBooks = [...booksOnPage1];

    // 3) Scrape the rest
    for (let page = 2; page <= totalPages; page++) {
      const { books } = await scrapeGoodreadsPage(page);
      console.log(`Found ${books.length} on page ${page}`);
      allBooks = allBooks.concat(books);

      // 1-second delay to reduce chance of rate-limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 1) Connect to Firestore
    const db = admin.firestore();

    // 2) Use a batch write
    const batch = db.batch();

    allBooks.forEach((book) => {
      // Create a new document reference
      // e.g. 'myGoodreadsBooks' is your collection name
      const docRef = db.collection("myGoodreadsBooks").doc();
      // Add the book data to the batch
      batch.set(docRef, book);
    });

    // 3) Commit the batch
    await batch.commit();

    console.log(`Saved ${allBooks.length} books to Firestore.`);
    return res.status(200).json(allBooks);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Error: getBooks");
  }
});
