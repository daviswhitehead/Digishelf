import type { Timestamp } from 'firebase-admin/firestore';

export interface Timestamps {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GoodreadsIntegration extends Timestamps {
  userId: string;
  displayName: string;
  profileUrl: string;
  sourceId: string;
  myBooksURL: string;
  shelves: string[];
  active: boolean;
}

export interface GoodreadsShelf extends Timestamps {
  shelfId: string;
  integrationId: string;
  userId: string;
  sourceId: string;
  sourceDisplayName: string;
  displayName: string;
  originalURL: string;
  bookCount: number;
  lastSynced?: Timestamp;
} 