export interface GoodreadsBook {
  title: string;
  author: string;
  coverImage: string | null;
  canonicalURL: string | null;
  userRating: number | null;
  userReview: string;
  primaryColor: string | null;
}

export type RatingMap = {
  'did not like it': 1;
  'it was ok': 2;
  'liked it': 3;
  'really liked it': 4;
  'it was amazing': 5;
};

export interface PageResult {
  books: GoodreadsBook[];
  $: ReturnType<typeof import('cheerio').load>;
} 