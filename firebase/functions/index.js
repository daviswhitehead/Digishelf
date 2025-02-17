const functions = require("firebase-functions");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// TO DO
// get larger label photos
// get full text of a review
// paginate through the whole list

function translateRating(ratingText) {
  // Translate "really liked it" to number of stars
  const ratingMap = {
    "did not like it": 1,
    "it was ok": 2,
    "liked it": 3,
    "really liked it": 4,
    "it was amazing": 5,
  };

  return ratingMap[ratingText.toLowerCase()] || null; // Default to 0 stars if not found
}
function cleanNewLines(s) {
  // Remove newlines and extra spaces
  return s.replace(/\n\s+/g, " ");
}
function writeHTML(html) {
  const filePath = path.join(__dirname, "goodreads.html");

  fs.writeFileSync(filePath, html, "utf8");
  console.log(`HTML saved to ${filePath}`);
}

exports.getBooks = functions.https.onRequest(async (req, res) => {
  try {
    // Replace with your Goodreads "read" shelf URL:
    // https://www.goodreads.com/review/list/61851004-davis-whitehead?ref=nav_mybooks&shelf=read
    const url =
      "https://www.goodreads.com/review/list/61851004-davis-whitehead?shelf=read";

    // Fetch the HTML from the Goodreads page
    const { data: html } = await axios.get(url);
    console.log("Fetched HTML");

    // writeHTML(html);

    // Load the HTML into Cheerio for parsing
    const $ = cheerio.load(html);
    const books = [];

    // Loop through each book review on the page
    $("tr.bookalike.review").each((i, elem) => {
      const coverImage = $(elem).find("td.field.cover img").attr("src");
      const title = $(elem).find("td.field.title a").text().trim();
      const author = $(elem).find("td.field.author a").first().text().trim();
      const rating =
        $(elem).find("td.field.rating span.staticStars").attr("title") || null;
      let review = $(elem)
        .find('td.field.review span[id^="freeTextContainer"]')
        .text()
        .trim();

      // If no review text is found, fallback to the full text (if present)
      if (!review) {
        review = $(elem).find("td.field.review").text().trim();
      }

      let detailsURL = $(elem).find("td.field.title a").attr("href") || null;
      if (detailsURL && detailsURL.indexOf("http") !== 0) {
        detailsURL = "https://www.goodreads.com" + detailsURL;
      }

      books.push({
        coverImage,
        title: cleanNewLines(title),
        author,
        detailsURL,
        rating: rating ? translateRating(rating) : null,
        review: cleanNewLines(review),
      });
    });

    // Return the scraped data as JSON
    res.status(200).json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: getBooks");
  }
});
