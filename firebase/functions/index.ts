import { initializeApp } from 'firebase-admin/app';
import { onCall, CallableRequest } from 'firebase-functions/v2/https';
import type { CallableOptions } from 'firebase-functions/v2/https';
import {
  onDocumentUpdated,
  onDocumentDeleted,
  onDocumentWritten,
  Change,
  FirestoreEvent,
  QueryDocumentSnapshot,
  DocumentOptions,
} from 'firebase-functions/v2/firestore';
import { getFirestore, Firestore, DocumentData, WriteBatch } from 'firebase-admin/firestore';
import {
  writeGoodreadsShelves,
  writeGoodreadsItems,
  refreshGoodreadsShelf,
} from './sources/goodreads/handlers.js';
import type { GoodreadsIntegration, GoodreadsShelf } from './shared/types.js';
import { processBatch } from './shared/utils/firestore.js';

initializeApp();
const db: Firestore = getFirestore();

type ShelfEvent = FirestoreEvent<Change<DocumentData> | undefined>;

/** @type {import('firebase-functions/v2/firestore').CloudFunction<FirestoreEvent<Change<QueryDocumentSnapshot>>>} */
export const onGoodreadsIntegrationUpdate = onDocumentUpdated(
  {
    document: 'goodreadsIntegrations/{integrationId}',
    region: 'us-central1',
  },
  async event => {
    const integrationId = event.params.integrationId;
    const data = event.data?.after?.data();

    if (!data) {
      console.info(`No data found for integration ${integrationId}`);
      return;
    }

    const after: GoodreadsIntegration = {
      userId: data.userId,
      displayName: data.displayName,
      profileUrl: data.profileUrl,
      sourceId: data.sourceId,
      myBooksURL: data.myBooksURL,
      shelves: data.shelves,
      active: data.active,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    try {
      console.time('writeGoodreadsShelves');
      await writeGoodreadsShelves(integrationId, after);
      console.timeEnd('writeGoodreadsShelves');
      console.info(`✅ Finished processing Goodreads integration: ${integrationId}`);
    } catch (error: unknown) {
      console.error('❌ Error processing Goodreads integration:', error);
      throw error;
    }
  }
);

export const onShelfWrite = onDocumentWritten(
  {
    document: 'shelves/{shelfId}',
    memory: '1GiB',
    timeoutSeconds: 180,
  },
  async (event: ShelfEvent): Promise<null> => {
    console.time('onShelfWrite');

    const shelfId = event.params.shelfId;
    const after = event.data?.after?.data() as GoodreadsShelf | undefined;

    if (!after) {
      console.info(`🗑️ Shelf was deleted — skipping: ${shelfId}`);
      return null;
    }

    const sourceName = (after.sourceDisplayName || '').toLowerCase();

    if (sourceName === 'goodreads') {
      console.info(`📥 Processing Goodreads shelf: ${shelfId}`);

      try {
        console.time('writeGoodreadsItems');
        await writeGoodreadsItems(shelfId, after);
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

export const onIntegrationDelete = onDocumentDeleted(
  {
    document: 'integrations/{integrationId}',
    memory: '512MiB',
    timeoutSeconds: 60,
  } as DocumentOptions<'integrations/{integrationId}'>,
  async (event: FirestoreEvent<QueryDocumentSnapshot | undefined>): Promise<void> => {
    const { integrationId } = event.params;

    try {
      // Delete all shelves and items associated with the integrationId
      const shelvesQuery = db.collection('shelves').where('integrationId', '==', integrationId);
      const itemsQuery = db.collection('items').where('integrationId', '==', integrationId);

      await Promise.all([
        processBatch(
          shelvesQuery,
          (batch: WriteBatch, doc: QueryDocumentSnapshot) => batch.delete(doc.ref),
          'Deleting shelves'
        ),
        processBatch(
          itemsQuery,
          (batch: WriteBatch, doc: QueryDocumentSnapshot) => batch.delete(doc.ref),
          'Deleting items'
        ),
      ]);

      console.log(`Successfully deleted all associated data for integrationId: ${integrationId}`);
    } catch (error) {
      console.error(`Error deleting associated data for integrationId: ${integrationId}`, error);
    }
  }
);

interface RefreshShelfData {
  shelfId: string;
}

interface RefreshShelfResponse {
  success: boolean;
  message: string;
  error?: {
    code?: string;
    message: string;
    stack?: string;
  };
}

const refreshShelfOptions: CallableOptions = {
  timeoutSeconds: 540,
  memory: '1GiB',
  region: 'us-central1',
};

export const refreshShelf = onCall(
  refreshShelfOptions,
  async (request: CallableRequest<RefreshShelfData>): Promise<RefreshShelfResponse> => {
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
      await refreshGoodreadsShelf(shelfId);
      return { success: true, message: 'Shelf refreshed successfully.' };
    } catch (error: unknown) {
      console.error(`❌ Error refreshing shelf: ${shelfId}`, error);
      const err = error as Error & { code?: string };
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
  }
);
