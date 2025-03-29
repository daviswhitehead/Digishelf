const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const {
  writeGoodreadsShelves,
  writeGoodreadsItems,
} = require("./handlers/goodreadsHandlers");

initializeApp();

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

// exports.onItemWrite = onDocumentWritten(
//   {
//     document: "items/{itemId}",
//     region:region,
//     memory: "512MiB", // optional
//     timeoutSeconds: 180, // optional
//   },
//   async (event) => {
//     // to do
//   }
// );
