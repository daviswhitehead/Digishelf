const fs = require('fs');
const path = require('path');

/**
 * Writes the provided HTML content to a file in the current directory.
 *
 * @param {string} html - The HTML content to be written to the file.
 */
function writeHTML(html) {
  const filePath = path.join(__dirname, 'goodreads.html');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`HTML saved to ${filePath}`);
}

module.exports = {
  writeHTML,
};
