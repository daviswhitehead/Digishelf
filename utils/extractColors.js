const Vibrant = require("node-vibrant");
const fs = require("fs");
const books = require("./data/books"); // Assuming your books data is in `data/books.js`

const getDominantColor = async (imageUrl) => {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();
    return palette.Vibrant.hex; // Use the Vibrant color; adjust as needed
  } catch (error) {
    console.error(`Failed to get color for ${imageUrl}:`, error);
    return "#a69b68"; // Fallback color if extraction fails
  }
};

const extractColors = async () => {
  const updatedBooks = [];
  for (const book of books) {
    const color = await getDominantColor(book.coverImage);
    updatedBooks.push({ ...book, dominantColor: color });
  }

  // Save the updated books data with colors
  fs.writeFileSync(
    "./data/booksWithColors.json",
    JSON.stringify(updatedBooks, null, 2),
  );
  console.log(
    "Color extraction complete! Updated books data saved to booksWithColors.json.",
  );
};

extractColors();
