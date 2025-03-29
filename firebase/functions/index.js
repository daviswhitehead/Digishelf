const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const { writeGoodreadsShelves } = require("./handlers/goodreadsHandlers");

initializeApp();
const db = getFirestore();

exports.onIntegrationWrite = onDocumentWritten(
  {
    document: "integrations/{integrationId}",
    region: "us-central1", // or your preferred region
    memory: "512MiB", // optional
    timeoutSeconds: 60, // optional
  },
  async (event) => {
    const integrationId = event.params.integrationId;
    const after = event.data?.after?.data();

    if (!after) {
      console.log(`❌ Integration ${integrationId} was deleted — skipping.`);
      return null;
    }

    const sourceId = after.sourceId;
    if (!sourceId) {
      console.log(
        `⚠️ Integration ${integrationId} missing sourceId — skipping.`
      );
      return null;
    }

    const sourceRef = db.collection("sources").doc(sourceId);
    const sourceSnap = await sourceRef.get();

    if (!sourceSnap.exists) {
      console.log(`❌ Source ${sourceId} does not exist — skipping.`);
      return null;
    }

    const sourceData = sourceSnap.data();
    const sourceName = (sourceData.displayName || "").toLowerCase();

    if (sourceName == "goodreads") {
      console.log(`📥 Processing Goodreads integration: ${integrationId}`);

      try {
        await writeGoodreadsShelves(integrationId, after);
        console.log("✅ Finished Goodreads shelf + item creation");
      } catch (err) {
        console.error(
          `🔥 Error handling Goodreads integration ${integrationId}`,
          err
        );
      }
    }
  }
);
