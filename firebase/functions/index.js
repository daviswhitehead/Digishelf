const functions = require("firebase-functions");
const admin = require("firebase-admin");

const { writeGoodreadsShelves } = require("./handlers/goodreadsHandlers");

admin.initializeApp();
const db = admin.firestore();

exports.onIntegrationWrite = functions.firestore
  .document("/integrations/{integrationId}")
  .onWrite(async (change, context) => {
    const integrationId = context.params.integrationId;
    const after = change.after.exists ? change.after.data() : null;

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

    // Get the source document
    const sourceRef = admin.firestore().collection("sources").doc(sourceId);
    const sourceSnap = await sourceRef.get();

    if (!sourceSnap.exists) {
      console.log(`❌ Source ${sourceId} does not exist — skipping.`);
      return null;
    }

    const sourceData = sourceSnap.data();
    const sourceName = (sourceData.displayName || "").toLowerCase();

    if (sourceName !== "goodreads") {
      console.log(
        `ℹ️ Integration ${integrationId} source is not Goodreads — skipping.`
      );
      return null;
    }

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

    return null;
  });
