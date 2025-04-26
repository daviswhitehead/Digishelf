import { Timestamp } from 'firebase-admin/firestore';
import { Timestamps } from '../../shared/types';
import type { CheerioAPI } from 'cheerio';

export interface GoodreadsBook {
  title: string;
  author: string;
  coverImg: string;
  isbn: string;
  avgRating: number;
  dateAdded: string;
  review: string;
  userRating: number;
}

export interface GoodreadsShelfData {
  shelfId: string;
  userId: string;
  sourceId: string;
  integrationId: string;
  books: GoodreadsBook[];
  totalBooks: number;
  lastRefreshed: string;
  $: CheerioAPI;
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
  $: CheerioAPI;
}
