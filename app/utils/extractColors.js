const Vibrant = require('node-vibrant');
const fs = require('fs');
const { allBooks } = require('../data/books'); // Update to destructure allBooks

const getDominantColor = async (imageUrl, retries = 0) => {
  try {
    // Add a small timeout between retries
    if (retries < 3) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const palette = await Vibrant.from(imageUrl).quality(1).maxColorCount(32).getPalette();

    if (!palette.Vibrant) {
      throw new Error('No vibrant color found');
    }

    return palette.Vibrant.hex;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying color extraction for ${imageUrl}... (${retries} attempts left)`);
      return getDominantColor(imageUrl, retries - 1);
    }
    console.error(`Failed to get color for ${imageUrl}:`, error);
    return '#a69b68'; // Fallback color
  }
};

const extractColors = async () => {
  const updatedBooks = [];
  for (const book of allBooks) {
    console.log(`Processing book: ${book.title}`);
    const color = await getDominantColor(book.coverImage);
    updatedBooks.push({ ...book, dominantColor: color });
  }

  // Save the updated books data with colors
  fs.writeFileSync('./data/booksWithColors.json', JSON.stringify(updatedBooks, null, 2));
  console.log('Color extraction complete! Updated books data saved to booksWithColors.json.');
};

extractColors().catch(console.error);
