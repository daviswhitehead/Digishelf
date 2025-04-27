'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.refreshShelf =
  exports.onIntegrationDelete =
  exports.onShelfWrite =
  exports.onIntegrationWrite =
    void 0;
const firestore_1 = require('firebase-functions/v2/firestore');
const app_1 = require('firebase-admin/app');
const firestore_2 = require('firebase-admin/firestore');
const https_1 = require('firebase-functions/v2/https');
const handlers_1 = require('./sources/goodreads/handlers');
const firestore_3 = require('./shared/utils/firestore');
(0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
exports.onIntegrationWrite = (0, firestore_1.onDocumentWritten)(
  {
    document: 'integrations/{integrationId}',
    memory: '512MiB',
    timeoutSeconds: 60,
  },
  async event => {
    var _a, _b;
    console.time('onIntegrationWrite');
    const integrationId = event.params.integrationId;
    const after =
      (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null ||
      _b === void 0
        ? void 0
        : _b.data();
    if (!after) {
      console.info(`🗑️ Integration was deleted — skipping: ${integrationId}`);
      return null;
    }
    const sourceName = (after.displayName || '').toLowerCase();
    if (sourceName === 'goodreads') {
      console.info(`📥 Processing Goodreads integration: ${integrationId}`);
      try {
        console.time('writeGoodreadsShelves');
        await (0, handlers_1.writeGoodreadsShelves)(integrationId, after);
        console.timeEnd('writeGoodreadsShelves');
        console.info(`✅ Finished processing Goodreads integration: ${integrationId}`);
        console.timeEnd('onIntegrationWrite');
        return null;
      } catch (err) {
        console.error(`🐛 Error processing Goodreads integration: ${integrationId}`, err);
        console.timeEnd('onIntegrationWrite');
        return null;
      }
    }
    return null;
  }
);
exports.onShelfWrite = (0, firestore_1.onDocumentWritten)(
  {
    document: 'shelves/{shelfId}',
    memory: '1GiB',
    timeoutSeconds: 180,
  },
  async event => {
    var _a, _b;
    console.time('onShelfWrite');
    const shelfId = event.params.shelfId;
    const after =
      (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null ||
      _b === void 0
        ? void 0
        : _b.data();
    if (!after) {
      console.info(`🗑️ Shelf was deleted — skipping: ${shelfId}`);
      return null;
    }
    const sourceName = (after.sourceDisplayName || '').toLowerCase();
    if (sourceName === 'goodreads') {
      console.info(`📥 Processing Goodreads shelf: ${shelfId}`);
      try {
        console.time('writeGoodreadsItems');
        await (0, handlers_1.writeGoodreadsItems)(shelfId, after);
        console.timeEnd('writeGoodreadsItems');
        console.info(`✅ Finished processing Goodreads shelf: ${shelfId}`);
        console.timeEnd('onShelfWrite');
        return null;
      } catch (err) {
        console.error(`🐛 Error processing Goodreads shelf: ${shelfId}`, err);
        console.timeEnd('onShelfWrite');
        return null;
      }
    }
    return null;
  }
);
exports.onIntegrationDelete = (0, firestore_1.onDocumentDeleted)(
  {
    document: 'integrations/{integrationId}',
    memory: '512MiB',
    timeoutSeconds: 60,
  },
  async event => {
    const { integrationId } = event.params;
    try {
      // Delete all shelves and items associated with the integrationId
      const shelvesQuery = db.collection('shelves').where('integrationId', '==', integrationId);
      const itemsQuery = db.collection('items').where('integrationId', '==', integrationId);
      await Promise.all([
        (0, firestore_3.processBatch)(
          shelvesQuery,
          (batch, doc) => batch.delete(doc.ref),
          'Deleting shelves'
        ),
        (0, firestore_3.processBatch)(
          itemsQuery,
          (batch, doc) => batch.delete(doc.ref),
          'Deleting items'
        ),
      ]);
      console.log(`Successfully deleted all associated data for integrationId: ${integrationId}`);
    } catch (error) {
      console.error(`Error deleting associated data for integrationId: ${integrationId}`, error);
    }
  }
);
const refreshShelfOptions = {
  timeoutSeconds: 540,
  memory: '1GiB',
  region: 'us-central1',
};
exports.refreshShelf = (0, https_1.onCall)(refreshShelfOptions, async (request, response) => {
  const data = request.data;
  const shelfId = data.shelfId;
  if (!shelfId) {
    return {
      success: false,
      message: 'Shelf ID is required',
    };
  }
  try {
    console.info(`🔄 Refresh request received for shelfId: ${shelfId}`);
    await (0, handlers_1.refreshGoodreadsShelf)(shelfId);
    return { success: true, message: 'Shelf refreshed successfully.' };
  } catch (error) {
    console.error(`❌ Error refreshing shelf: ${shelfId}`, error);
    const err = error;
    return {
      success: false,
      message: err.message || 'Failed to refresh shelf',
      error: {
        code: err.code,
        message: err.message,
        stack: err.stack,
      },
    };
  }
});
//# sourceMappingURL=index.js.map
