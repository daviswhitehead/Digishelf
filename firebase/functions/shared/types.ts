// @ts-check

import { Timestamp } from 'firebase-admin/firestore';

export interface Timestamps {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastSyncedAt?: Timestamp;
}

export interface GoodreadsIntegration extends Timestamps {
  id: string;
  userId: string;
  sourceId: string;
  accountId: string;
  accountSlug: string;
  status: 'active' | 'inactive' | 'error';
  error?: string;
  displayName: string;
  myBooksURL: string;
  shelves: string[];
}

export interface GoodreadsShelf extends Timestamps {
  id: string;
  userId: string;
  sourceId: string;
  integrationId: string;
  displayName: string;
  sourceDisplayName: string;
  description?: string;
  bookCount: number;
  isExclusive: boolean;
  isPrivate: boolean;
  sortOrder?: number;
  originalURL: string;
}

// Constants for type checking
export const timestamps = {
  createdAt: true,
  updatedAt: true,
  lastSyncedAt: true,
};

export const goodreadsIntegration = {
  id: true,
  userId: true,
  sourceId: true,
  accountId: true,
  accountSlug: true,
  status: true,
  error: true,
  displayName: true,
  myBooksURL: true,
  shelves: true,
  ...timestamps,
};

export const goodreadsShelf = {
  id: true,
  userId: true,
  sourceId: true,
  integrationId: true,
  displayName: true,
  sourceDisplayName: true,
  description: true,
  bookCount: true,
  isExclusive: true,
  isPrivate: true,
  sortOrder: true,
  originalURL: true,
  ...timestamps,
};

// Export the type definitions
export const Types = {
  /** @typedef {Timestamps} */
  Timestamps: null,
  /** @typedef {GoodreadsIntegration} */
  GoodreadsIntegration: null,
  /** @typedef {GoodreadsShelf} */
  GoodreadsShelf: null,
};

// Make this file a module
export {};
