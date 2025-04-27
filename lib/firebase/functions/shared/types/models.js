"use strict";
/**
 * @typedef {Object} BaseIntegration
 * @property {string} integrationId - Firestore document ID
 * @property {string} userId - Owner's user ID
 * @property {string} sourceId - Source identifier
 * @property {string} displayName - Source display name
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
/**
 * @typedef {Object} BaseShelf
 * @property {string} shelfId - Firestore document ID
 * @property {string} userId - Owner's user ID
 * @property {string} sourceId - Source identifier
 * @property {string} integrationId - Integration identifier
 * @property {string} sourceDisplayName - Source display name
 * @property {string} displayName - Shelf name
 * @property {string} originalURL - Original source URL
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Date} [lastRefreshedAt] - Last refresh timestamp
 */
/**
 * @typedef {Object} BaseItem
 * @property {string} itemId - Firestore document ID
 * @property {string} shelfId - Parent shelf ID
 * @property {string} userId - Owner's user ID
 * @property {string} sourceId - Source identifier
 * @property {string} integrationId - Integration identifier
 * @property {string} title - Item title
 * @property {string} canonicalURL - Source canonical URL
 * @property {string} [coverImage] - Cover image URL
 * @property {string} [primaryColor] - Dominant color of cover
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
/**
 * @typedef {Object} FirestoreTimestamp
 * @property {function(): Date} toDate - Converts to JavaScript Date
 * @property {number} seconds - Seconds since epoch
 * @property {number} nanoseconds - Additional precision in nanoseconds
 */
//# sourceMappingURL=models.js.map