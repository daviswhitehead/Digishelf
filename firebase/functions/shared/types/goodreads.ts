import type { CheerioAPI } from 'cheerio';

export interface GoodreadsBook {
  title: string;
  author: string;
  coverImage: string | null;
  canonicalURL: string | null;
  userRating: number | null;
  userReview: string;
  primaryColor: string | null;
  url?: string; // Making this optional since it's used in scrapeBookPage
}

export interface PageResult {
  books: GoodreadsBook[];
  $: CheerioAPI;
}

export type RatingMap = {
  'did not like it': 1;
  'it was ok': 2;
  'liked it': 3;
  'really liked it': 4;
  'it was amazing': 5;
};
