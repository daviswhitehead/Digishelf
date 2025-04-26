const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { getFunctions } = require('firebase-admin/functions');

const db = getFirestore();

/**
 * Creates a test user document
 * @param {string} userId - The user ID
 * @param {Object} [data] - Additional user data
 */
async function createTestUser(userId, data = {}) {
  await db.collection('users').doc(userId).set({
    userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    ...data,
  });
}

/**
 * Creates a test source document
 * @param {string} sourceId - The source ID
 * @param {Object} [data] - Additional source data
 */
async function createTestSource(sourceId, data = {}) {
  await db.collection('sources').doc(sourceId).set({
    sourceId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    ...data,
  });
}

/**
 * Creates a test integration document
 * @param {string} integrationId - The integration ID
 * @param {string} userId - The user ID
 * @param {string} sourceId - The source ID
 * @param {Object} [data] - Additional integration data
 */
async function createTestIntegration(integrationId, userId, sourceId, data = {}) {
  await db.collection('integrations').doc(integrationId).set({
    integrationId,
    userId,
    sourceId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    ...data,
  });
}

/**
 * Creates a test shelf document
 * @param {string} shelfId - The shelf ID
 * @param {string} userId - The user ID
 * @param {string} sourceId - The source ID
 * @param {string} integrationId - The integration ID
 * @param {Object} [data] - Additional shelf data
 */
async function createTestShelf(shelfId, userId, sourceId, integrationId, data = {}) {
  await db.collection('shelves').doc(shelfId).set({
    shelfId,
    userId,
    sourceId,
    integrationId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    ...data,
  });
}

/**
 * Creates a test item document
 * @param {string} itemId - The item ID
 * @param {string} shelfId - The shelf ID
 * @param {string} integrationId - The integration ID
 * @param {Object} [data] - Additional item data
 */
async function createTestItem(itemId, shelfId, integrationId, data = {}) {
  await db.collection('items').doc(itemId).set({
    itemId,
    shelfId,
    integrationId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    ...data,
  });
}

/**
 * Calls a Firebase function
 * @param {string} name - The function name
 * @param {Object} data - The function data
 * @returns {Promise<any>} The function result
 */
async function callFunction(name, data) {
  const fn = getFunctions().httpsCallable(name);
  const result = await fn(data);
  return result.data;
}

/**
 * Cleans up test data
 * @param {Object} collections - Collections to clean
 * @param {string[]} collections.users - User IDs to delete
 * @param {string[]} collections.sources - Source IDs to delete
 * @param {string[]} collections.integrations - Integration IDs to delete
 * @param {string[]} collections.shelves - Shelf IDs to delete
 * @param {string[]} collections.items - Item IDs to delete
 */
async function cleanup({ users = [], sources = [], integrations = [], shelves = [], items = [] } = {}) {
  const batch = db.batch();

  users.forEach((id) => batch.delete(db.collection('users').doc(id)));
  sources.forEach((id) => batch.delete(db.collection('sources').doc(id)));
  integrations.forEach((id) => batch.delete(db.collection('integrations').doc(id)));
  shelves.forEach((id) => batch.delete(db.collection('shelves').doc(id)));
  items.forEach((id) => batch.delete(db.collection('items').doc(id)));

  await batch.commit();
}

module.exports = {
  createTestUser,
  createTestSource,
  createTestIntegration,
  createTestShelf,
  createTestItem,
  callFunction,
  cleanup,
}; 