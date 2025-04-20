const {
  onDocumentWritten,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { https } = require("firebase-functions/v2");
const {
  writeGoodreadsShelves,
  writeGoodreadsItems,
  refreshGoodreadsShelf,
} = require("./handlers/goodreadsHandlers");

initializeApp();
const db = getFirestore();

exports.onIntegrationWrite = onDocumentWritten(
  {
    document: "integrations/{integrationId}",
    memory: "512MiB", // optional
    timeoutSeconds: 60, // optional
  },
  async (event) => {
    console.time("onIntegrationWrite");

    const integrationId = event.params.integrationId;
    const after = event.data && event.data.after && event.data.after.data();

    if (!after) {
      console.info(`🗑️ Integration was deleted — skipping: ${integrationId}`);
      return null;
    }

    const sourceName = (after.displayName || "").toLowerCase();

    if (sourceName == "goodreads") {
      console.info(`📥 Processing Goodreads integration: ${integrationId}`);

      try {
        console.time("writeGoodreadsShelves");
        await writeGoodreadsShelves(integrationId, after);
        console.timeEnd("writeGoodreadsShelves");
        console.info(
          `✅ Finished processing Goodreads integration: ${integrationId}`
        );
        console.timeEnd("onIntegrationWrite");
      } catch (err) {
        console.error(
          `🐛 Error processing Goodreads integration: ${integrationId}`,
          err
        );
        console.timeEnd("onIntegrationWrite");
      }
    }
  }
);

exports.onShelfWrite = onDocumentWritten(
  {
    document: "shelves/{shelfId}",
    memory: "1GiB", // optional
    timeoutSeconds: 180, // optional
  },
  async (event) => {
    console.time("onShelfWrite");

    const shelfId = event.params.shelfId;
    const after = event.data && event.data.after && event.data.after.data();

    if (!after) {
      console.info(`🗑️ Shelf was deleted — skipping: ${shelfId}`);
      return null;
    }

    const sourceName = (after.sourceDisplayName || "").toLowerCase();

    if (sourceName == "goodreads") {
      console.info(`📥 Processing Goodreads shelf: ${shelfId}`);

      try {
        console.time("writeGoodreadsItems");
        await writeGoodreadsItems(shelfId, after);
        console.timeEnd("writeGoodreadsItems");
        console.info(`✅ Finished processing Goodreads shelf: ${shelfId}`);
        console.timeEnd("onShelfWrite");
      } catch (err) {
        console.error(`🐛 Error processing Goodreads shelf: ${shelfId}`, err);
        console.timeEnd("onShelfWrite");
      }
    }
  }
);

exports.onIntegrationDelete = onDocumentDeleted(
  {
    document: "integrations/{integrationId}",
    memory: "512MiB", // Optional: Adjust memory allocation
    timeoutSeconds: 60, // Optional: Adjust timeout
  },
  async (event) => {
    const { integrationId } = event.params;

    try {
      const batch = db.batch();

      // Delete all shelves associated with the integrationId
      const shelvesQuery = db
        .collection("shelves")
        .where("integrationId", "==", integrationId);
      const shelvesSnapshot = await shelvesQuery.get();

      shelvesSnapshot.docs.forEach((doc) => {
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

      itemsSnapshot.docs.forEach((doc) => {
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

exports.refreshShelf = https.onCall(async (data, context) => {
  console.info("Request data:", data); // Log the request data
  console.info("Auth context:", context.auth); // Log the auth context

  if (!context.auth) {
    throw new https.HttpsError(
      "unauthenticated",
      "User must be authenticated."
    );
  }

  const { shelfId } = data;

  if (!shelfId) {
    throw new https.HttpsError("invalid-argument", "Shelf ID is required.");
  }

  try {
    console.info(`🔄 Refresh request received for shelfId: ${shelfId}`);
    await refreshGoodreadsShelf(shelfId);
    return { success: true, message: "Shelf refreshed successfully." };
  } catch (error) {
    console.error(`❌ Error refreshing shelf: ${shelfId}`, error);
    throw new https.HttpsError("internal", error.message);
  }
});
