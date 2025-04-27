const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

/**
 * Maximum number of operations in a single batch
 * @type {number}
 */
const BATCH_SIZE = 500;

/**
 * Processes items in batches with Firestore
 * @template T
 * @param {T[]} items - Items to process
 * @param {function(T, admin.firestore.WriteBatch): Promise<void>} processFn - Function to process each item
 * @param {Object} options - Processing options
 * @param {string} [options.label] - Label for logging
 * @param {boolean} [options.silent] - Whether to suppress logs
 * @returns {Promise<void>}
 */
async function processBatch(items, processFn, { label = '', silent = false } = {}) {
  let batch = admin.firestore().batch();
  let operationCount = 0;
  let totalProcessed = 0;

  for (const item of items) {
    await processFn(item, batch);
    operationCount++;
    totalProcessed++;

    if (operationCount === BATCH_SIZE) {
      await batch.commit();
      if (!silent) {
        console.info(
          `✅ Committed batch of ${BATCH_SIZE} items${label ? ` for ${label}` : ''} (${totalProcessed}/${items.length} total)`
        );
      }
      batch = admin.firestore().batch();
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
    if (!silent) {
      console.info(
        `✅ Committed remaining ${operationCount} items${label ? ` for ${label}` : ''} (${totalProcessed}/${items.length} total)`
      );
    }
  }
}

/**
 * Creates timestamps for a new document
 * @returns {{ createdAt: admin.firestore.FieldValue, updatedAt: admin.firestore.FieldValue }}
 */
function getNewDocumentTimestamps() {
  const now = FieldValue.serverTimestamp();
  return {
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Gets timestamp for updating a document
 * @returns {{ updatedAt: admin.firestore.FieldValue }}
 */
function getUpdateTimestamp() {
  return {
    updatedAt: FieldValue.serverTimestamp(),
  };
}

/**
 * Finds a document by multiple field conditions
 * @param {string} collection - Collection name
 * @param {Object.<string, any>} conditions - Field conditions
 * @returns {Promise<admin.firestore.QueryDocumentSnapshot|null>}
 */
async function findDocumentByFields(collection, conditions) {
  const query = Object.entries(conditions).reduce(
    (q, [field, value]) => q.where(field, '==', value),
    admin.firestore().collection(collection)
  );

  const snapshot = await query.limit(1).get();
  return snapshot.empty ? null : snapshot.docs[0];
}

module.exports = {
  BATCH_SIZE,
  processBatch,
  getNewDocumentTimestamps,
  getUpdateTimestamp,
  findDocumentByFields,
};
