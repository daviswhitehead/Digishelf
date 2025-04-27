// @ts-check

import { Timestamp } from 'firebase-admin/firestore';

/**
 * @typedef {Object} Timestamps
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @typedef {Object & Timestamps} GoodreadsIntegration
 * @property {string} userId
 * @property {string} displayName
 * @property {string} profileUrl
 * @property {string} sourceId
 * @property {string} myBooksURL
 * @property {Array<string>} shelves
 * @property {boolean} active
 */

/**
 * @typedef {Object & Timestamps} GoodreadsShelf
 * @property {string} shelfId
 * @property {string} integrationId
 * @property {string} userId
 * @property {string} sourceId
 * @property {string} sourceDisplayName
 * @property {string} displayName
 * @property {string} originalURL
 * @property {number} bookCount
 * @property {Timestamp} [lastSynced]
 */

/** @type {Timestamps} */
export const timestamps = {
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

/** @type {GoodreadsIntegration} */
export const goodreadsIntegration = {
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  // Add other required properties here
};

/** @type {GoodreadsShelf} */
export const goodreadsShelf = {
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  // Add other required properties here
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
