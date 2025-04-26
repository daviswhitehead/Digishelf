export const SHELF_SLUG_MAP: Record<string, string> = {
  'All': 'all',
  'Read': 'read',
  'Currently Reading': 'currently-reading',
  'Want to Read': 'to-read',
};

export const RATING_MAP: Record<string, number> = {
  'did not like it': 1,
  'it was ok': 2,
  'liked it': 3,
  'really liked it': 4,
  'it was amazing': 5,
};

interface ConcurrencyConfig {
  PAGE_REQUESTS: number;
  COLOR_PROCESSING: number;
}

export const CONCURRENCY: ConcurrencyConfig = {
  PAGE_REQUESTS: 5, // Maximum concurrent page requests
  COLOR_PROCESSING: 3, // Maximum concurrent color processing operations
}; 