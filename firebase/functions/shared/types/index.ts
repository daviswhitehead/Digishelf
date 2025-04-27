import { Timestamp } from 'firebase-admin/firestore';

export interface Timestamps {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastRefreshedAt?: Timestamp;
}

export type Integration = GoodreadsIntegration;
export type Shelf = GoodreadsShelf;

export interface GoodreadsIntegration extends Timestamps {
  integrationId: string;
  userId: string;
  sourceId: string;
  displayName: string;
  myBooksURL: string;
  shelves: string[];
}

export interface GoodreadsShelf extends Timestamps {
  shelfId: string;
  userId: string;
  sourceId: string;
  integrationId: string;
  sourceDisplayName: string;
  displayName: string;
  originalURL: string;
}

export interface GoodreadsItem extends Timestamps {
  itemId: string;
  shelfId: string;
  integrationId: string;
  userId: string;
  sourceId: string;
  title: string;
  author: string;
  coverImageURL?: string;
  canonicalURL: string;
  rating?: number;
  review?: string;
  dateAdded?: string;
  dateRead?: string;
  readCount?: number;
  dominantColors?: {
    [key: string]: string;
  };
}
