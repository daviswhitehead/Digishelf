const functions = require("firebase-functions");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// TO DO
// Translate "really liked it" to number of stars
function translateRating(ratingText) {
  const ratingMap = {
    "did not like it": 1,
    "it was ok": 2,
    "liked it": 3,
    "really liked it": 4,
    "it was amazing": 5,
  };

  return ratingMap[ratingText.toLowerCase()] || null; // Default to 0 stars if not found
}

// get larger label photos
// get full text of a review
// paginate through the whole list
// fix new line issues `Iron Flame\n        (The Empyrean, #2)",` and `"review\n            None"`
// add url to goodreads to dataset

exports.getBooks = functions.https.onRequest(async (req, res) => {
  console.log("Scraping Goodreads...");
  try {
    // Replace with your Goodreads "read" shelf URL:
    // https://www.goodreads.com/review/list/61851004-davis-whitehead?ref=nav_mybooks&shelf=read
    const url =
      "https://www.goodreads.com/review/list/61851004-davis-whitehead?shelf=read";

    // Fetch the HTML from the Goodreads page
    const { data: html } = await axios.get(url);
    console.log("Fetched HTML");
    // const filePath = path.join(__dirname, "goodreads.html");

    // fs.writeFileSync(filePath, html, "utf8");
    // console.log(`HTML saved to ${filePath}`);

    // Load the HTML into Cheerio for parsing
    const $ = cheerio.load(html);
    const books = [];

    // Inspect the HTML structure on Goodreads to find the right selectors.
    // The following selectors are illustrative
    // you may need to adjust them based on the current page structure.
    $("tr.bookalike.review").each((i, elem) => {
      //   const coverImage = $(elem).find("td.field.cover a img").attr("src");
      const coverImage = $(elem).find("td.field.cover img").attr("src");

      //   const title = $(elem)
      //     .find("td.field.title div.value a.bookTitle span")
      //     .text()
      //     .trim();
      let title = $(elem).find("td.field.title a").text().trim();

      //   const author = $(elem)
      //     .find("td.field.author div.value a.authorName span")
      //     .text()
      //     .trim();
      let author = $(elem).find("td.field.author a").first().text().trim();

      // The rating might be stored as a title attribute
      // on a star span or similar.
      //   const rating =
      //     $(elem)
      //       .find("td.field.rating div.value span.staticStars")
      //       .attr("title") || null;
      let rating =
        $(elem).find("td.field.rating span.staticStars").attr("title") || null;
      const translatedRating = rating ? translateRating(rating) : null;

      // Reviews might be nested deeper;
      // adjust the selector based on what you see in the HTML.
      //   const review =
      //     $(elem)
      //       .find("td.field.review div.value span.readable span")
      //       .last() // In case there are multiple spans (short vs. full review)
      //       .text()
      //       .trim() || null;
      // Review: look for a span whose id starts with "freeTextContainer" inside the "review" field.
      let review = $(elem)
        .find('td.field.review span[id^="freeTextContainer"]')
        .text()
        .trim();
      // If no review text is found, fallback to the full text (if present)
      if (!review) {
        review = $(elem).find("td.field.review").text().trim();
      }

      books.push({
        coverImage,
        title,
        author,
        translatedRating,
        review,
      });
    });

    // Return the scraped data as JSON
    res.status(200).json(books);
  } catch (error) {
    console.error("Error scraping Goodreads:", error);
    res.status(500).send("Error scraping data");
  }
});
