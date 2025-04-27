export interface BaseBook {
  id: string;
  title: string;
  author: string;
}

export interface BookMetadata {
  coverImage?: string;
  description?: string;
  isbn?: string;
  pageCount?: number;
  publishedDate?: string;
  publisher?: string;
}

export interface BookExtras {
  primaryColor?: string | null;
  canonicalURL?: string;
  userRating?: number | null;
  userReview?: string | null;
  sourceId?: string;
  sourceDisplayName?: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface Book extends BaseBook, BookMetadata, BookExtras {}

export type { Book as default };
