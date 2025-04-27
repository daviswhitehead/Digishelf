import { initializeApp } from 'firebase-admin/app';
import { onCall } from 'firebase-functions/v2/https';
import type { CallableOptions } from 'firebase-functions/v2/https';
import {
  onDocumentUpdated,
  onDocumentDeleted,
  onDocumentWritten,
  Change,
  FirestoreEvent,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  DocumentOptions,
} from 'firebase-functions/v2/firestore';
import { getFirestore, Firestore, WriteBatch } from 'firebase-admin/firestore';
import { writeGoodreadsShelves, writeGoodreadsItems } from './sources/goodreads/handlers.js';
import type { GoodreadsIntegration, GoodreadsShelf } from './shared/types/index.js';
import { processBatch } from './shared/utils/firestore.js';
import { handleRefreshShelf } from './handlers/refreshShelf.js';

initializeApp();
const db: Firestore = getFirestore();

export const onGoodreadsIntegrationUpdate = onDocumentUpdated(
  {
    document: 'goodreadsIntegrations/{integrationId}',
    region: 'us-central1',
  } as DocumentOptions<'goodreadsIntegrations/{integrationId}'>,
  async (
    event: FirestoreEvent<Change<DocumentSnapshot> | undefined, { integrationId: string }>
  ) => {
    const integrationId = event.params.integrationId;
    const data = event.data?.after?.data();

    if (!data) {
      console.info(`No data found for integration ${integrationId}`);
      return;
    }

    const after: GoodreadsIntegration = {
      integrationId: integrationId,
      userId: data.userId,
      sourceId: data.sourceId,
      displayName: data.displayName,
      myBooksURL: data.myBooksURL,
      shelves: data.shelves,
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
  } as DocumentOptions<'shelves/{shelfId}'>,
  async (
    event: FirestoreEvent<Change<DocumentSnapshot> | undefined, { shelfId: string }>
  ): Promise<null> => {
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
  async (
    event: FirestoreEvent<DocumentSnapshot | undefined, { integrationId: string }>
  ): Promise<void> => {
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

const refreshShelfOptions: CallableOptions = {
  timeoutSeconds: 540,
  memory: '1GiB',
  region: 'us-central1',
};

export const refreshShelf = onCall(refreshShelfOptions, handleRefreshShelf);
