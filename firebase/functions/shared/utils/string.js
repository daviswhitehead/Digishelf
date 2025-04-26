/**
 * Removes newlines and extra spaces from a string
 * @param {string} str - The string to clean
 * @return {string} The cleaned string
 */
function cleanWhitespace(str) {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Ensures a URL has a protocol
 * @param {string} url - The URL to process
 * @param {string} [defaultProtocol='https'] - Protocol to add if missing
 * @return {string} The processed URL
 */
function ensureProtocol(url, defaultProtocol = 'https') {
  if (!url) return url;
  return url.startsWith('http') ? url : `${defaultProtocol}://${url.replace(/^\/+/, '')}`;
}

/**
 * Removes size specifiers from image URLs
 * @param {string} imageUrl - The image URL to process
 * @return {string} The processed URL
 */
function removeImageSizeFromUrl(imageUrl) {
  if (!imageUrl) return imageUrl;
  return imageUrl.replace(/\._S[XY]\d+_/, '');
}

/**
 * Converts a display name to a URL-friendly slug
 * @param {string} displayName - The display name to convert
 * @return {string} The URL-friendly slug
 */
function toUrlSlug(displayName) {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = {
  cleanWhitespace,
  ensureProtocol,
  removeImageSizeFromUrl,
  toUrlSlug,
}; 