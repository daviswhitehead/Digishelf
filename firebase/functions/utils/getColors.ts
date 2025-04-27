import { Vibrant } from 'node-vibrant/node';

/**
 * Gets the primary color of an image using the Vibrant library.
 */
export async function getDominantColor(imageUrl: string): Promise<string | null> {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();

    if (!palette.Vibrant) {
      console.warn(`No vibrant color found for ${imageUrl}`);
      return null;
    }

    return palette.Vibrant.hex;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to get color for ${imageUrl}:`, error.message);
    } else {
      console.error(`Failed to get color for ${imageUrl}:`, error);
    }
    return null;
  }
}
