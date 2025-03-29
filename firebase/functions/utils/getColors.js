const { Vibrant } = require("node-vibrant/node");

/**
 * Gets the primary color of an image using the Vibrant library.
 *
 * @param {string} imageUrl - The URL for an image.
 * @return {string | null} - The hex code of a color or null.
 */
async function getDominantColor(imageUrl) {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();

    if (!palette.Vibrant) {
      console.log("No vibrant color found");
      return null;
    }

    return palette.Vibrant.hex;
  } catch (error) {
    console.error(`Failed to get color for ${imageUrl}:`, error);
    return null;
  }
}

module.exports = {
  getDominantColor,
};
