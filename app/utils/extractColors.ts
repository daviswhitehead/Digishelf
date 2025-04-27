import { Vibrant } from 'node-vibrant/node';

interface _RGB {
  r: number;
  g: number;
  b: number;
}

export const getDominantColor = async (imageUrl: string, retries = 0): Promise<string | null> => {
  if (retries > 3) return null;

  try {
    const vibrant = new Vibrant(imageUrl);
    const palette = await vibrant.getPalette();

    if (!palette.Vibrant) return null;

    const dominantColor = palette.Vibrant.rgb;
    return `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
  } catch (error) {
    console.error('Error extracting color:', error);
    // Retry with exponential backoff
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    return getDominantColor(imageUrl, retries + 1);
  }
};

// Note: The extractColors function has been removed as it was specific to a data processing script
// If you need to process books data, create a separate script for that purpose
