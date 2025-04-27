'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CONCURRENCY = exports.RATING_MAP = exports.SHELF_SLUG_MAP = void 0;
exports.SHELF_SLUG_MAP = {
  All: 'all',
  Read: 'read',
  'Currently Reading': 'currently-reading',
  'Want to Read': 'to-read',
};
exports.RATING_MAP = {
  'did not like it': 1,
  'it was ok': 2,
  'liked it': 3,
  'really liked it': 4,
  'it was amazing': 5,
};
exports.CONCURRENCY = {
  PAGE_REQUESTS: 5, // Maximum concurrent page requests
  COLOR_PROCESSING: 3, // Maximum concurrent color processing operations
};
//# sourceMappingURL=constants.js.map
