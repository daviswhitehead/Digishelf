'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.FIXTURES = void 0;
exports.loadFixture = loadFixture;
const fs_1 = require('fs');
const path_1 = require('path');
/**
 * Loads a fixture file from the __fixtures__ directory
 */
function loadFixture(relativePath) {
  const fixturesDir = (0, path_1.join)(__dirname);
  const fullPath = (0, path_1.join)(fixturesDir, relativePath);
  return (0, fs_1.readFileSync)(fullPath, 'utf8');
}
/**
 * Known fixture paths
 */
exports.FIXTURES = {
  SINGLE_PAGE: 'responses/single_page.html',
  MULTI_PAGE: 'responses/multi_page.html',
  EMPTY_SHELF: 'responses/empty_shelf.html',
  SUBSEQUENT_PAGE: 'responses/subsequent_page.html',
};
//# sourceMappingURL=loadFixture.js.map
