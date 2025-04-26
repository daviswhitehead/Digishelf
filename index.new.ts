import {
  onDocumentWritten,
  onDocumentDeleted,
  Change,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import {
  getFirestore,
  Firestore,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {
  onCall,
  HttpsError,
  CallableRequest,
  CallableOptions,
} from "firebase-functions/v2/https";
import {
  writeGoodreadsShelves,
  writeGoodreadsItems,
  refreshGoodreadsShelf,
} from "./sources/goodreads/handlers";
import { GoodreadsIntegration, GoodreadsShelf } from "./shared/types";

initializeApp();
const db: Firestore = getFirestore();

type IntegrationEvent = FirestoreEvent<Change<DocumentData> | undefined>;
type ShelfEvent = FirestoreEvent<Change<DocumentData> | undefined>;

export const onIntegrationWrite = onDocumentWritten(
  {
    document: "integrations/{integrationId}",
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (event: IntegrationEvent): Promise<null> => {
    console.time("onIntegrationWrite");

    const integrationId = event.params.integrationId;
    const after = event.data?.after?.data() as GoodreadsIntegration | undefined;

    if (!after) {
      console.info(`🗑️ Integration was deleted — skipping: ${integrationId}`);
      return null;
    }

    const sourceName = (after.displayName || "").toLowerCase();

    if (sourceName === "goodreads") {
      console.info(`📥 Processing Goodreads integration: ${integrationId}`);

      try {
        console.time("writeGoodreadsShelves");
        await writeGoodreadsShelves(integrationId, after);
        console.timeEnd("writeGoodreadsShelves");
        console.info(
          `✅ Finished processing Goodreads integration: ${integrationId}`
        );
        console.timeEnd("onIntegrationWrite");
        return null;
      } catch (err) {
        console.error(
          `🐛 Error processing Goodreads integration: ${integrationId}`,
          err
        );
        console.timeEnd("onIntegrationWrite");
        return null;
      }
    }
    return null;
  }
);

export const onShelfWrite = onDocumentWritten(
  {
    document: "shelves/{shelfId}",
    memory: "1GiB",
    timeoutSeconds: 180,
  },
  async (event: ShelfEvent): Promise<null> => {
    console.time("onShelfWrite");

    const shelfId = event.params.shelfId;
    const after = event.data?.after?.data() as GoodreadsShelf | undefined;

    if (!after) {
      console.info(`🗑️ Shelf was deleted — skipping: ${shelfId}`);
      return null;
    }

    const sourceName = (after.sourceDisplayName || "").toLowerCase();

    if (sourceName === "goodreads") {
      console.info(`📥 Processing Goodreads shelf: ${shelfId}`);

      try {
        console.time("writeGoodreadsItems");
        await writeGoodreadsItems(shelfId, after);
        console.timeEnd("writeGoodreadsItems");
        console.info(`✅ Finished processing Goodreads shelf: ${shelfId}`);
        console.timeEnd("onShelfWrite");
        return null;
      } catch (err) {
        console.error(`🐛 Error processing Goodreads shelf: ${shelfId}`, err);
        console.timeEnd("onShelfWrite");
        return null;
      }
    }
    return null;
  }
);

export const onIntegrationDelete = onDocumentDeleted(
  {
    document: "integrations/{integrationId}",
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (event: FirestoreEvent<Change<DocumentData> | undefined>): Promise<void> => {
    const { integrationId } = event.params;

    try {
      const batch = db.batch();

      // Delete all shelves associated with the integrationId
      const shelvesQuery = db
        .collection("shelves")
        .where("integrationId", "==", integrationId);
      const shelvesSnapshot = await shelvesQuery.get();

      shelvesSnapshot.docs.forEach((doc: QueryDocumentSnapshot) => {
        batch.delete(doc.ref);
      });
      console.log(
        `Queued ${shelvesSnapshot.size} shelves for deletion for integrationId: ${integrationId}`
      );

      // Delete all items associated with the integrationId
      const itemsQuery = db
        .collection("items")
        .where("integrationId", "==", integrationId);
      const itemsSnapshot = await itemsQuery.get();

      itemsSnapshot.docs.forEach((doc: QueryDocumentSnapshot) => {
        batch.delete(doc.ref);
      });
      console.log(
        `Queued ${itemsSnapshot.size} items for deletion for integrationId: ${integrationId}`
      );

      // Commit the batch
      await batch.commit();
      console.log(
        `Successfully deleted all associated data for integrationId: ${integrationId}`
      );
    } catch (error) {
      console.error(
        `Error deleting associated data for integrationId: ${integrationId}`,
        error
      );
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
  memory: "1GiB",
  region: "us-central1",
};

export const refreshShelf = onCall<RefreshShelfData, RefreshShelfResponse>(
  refreshShelfOptions,
  async (request: CallableRequest<RefreshShelfData>): Promise<RefreshShelfResponse> => {
    const data = request.data;
    const shelfId = data.shelfId;

    if (!shelfId) {
      throw new HttpsError("invalid-argument", "Shelf ID is required");
    }

    try {
      console.info(`🔄 Refresh request received for shelfId: ${shelfId}`);
      await refreshGoodreadsShelf(shelfId);
      return { success: true, message: "Shelf refreshed successfully." };
    } catch (error: unknown) {
      console.error(`❌ Error refreshing shelf: ${shelfId}`, error);
      const err = error as Error & { code?: string };
      return {
        success: false,
        message: err.message || "Failed to refresh shelf",
        error: {
          code: err.code,
          message: err.message,
          stack: err.stack,
        },
      };
    }
  }
); 