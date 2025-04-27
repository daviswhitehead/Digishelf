import { Timestamp as _Timestamp } from 'firebase-admin/firestore';
import type { Timestamps } from '../../shared/types.js';
import type { load } from 'cheerio';

export interface GoodreadsBook {
  title: string;
  author: string;
  coverImage: string;
  canonicalURL: string;
  userRating: number | null;
  userReview: string | null;
  primaryColor: string | null;
  dateAdded?: string;
  dateRead?: string;
  readCount?: number;
}

export interface GoodreadsShelfData extends Timestamps {
  shelfId: string;
  userId: string;
  sourceId: string;
  integrationId: string;
  sourceDisplayName: string;
  displayName: string;
  originalURL: string;
}

export interface GoodreadsIntegrationData extends Timestamps {
  userId: string;
  sourceId: string;
  displayName: string;
  myBooksURL: string;
  shelves: string[];
}

export interface PageResult {
  books: GoodreadsBook[];
  $: ReturnType<typeof load>;
}
