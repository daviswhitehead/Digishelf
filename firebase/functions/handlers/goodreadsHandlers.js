const admin = require("firebase-admin");
const db = admin.firestore();

const shelfSlugMap = {
  All: "all",
  Read: "read",
  "Currently Reading": "currently-reading",
  "Want to Read": "to-read",
};

/**
 * Creates or updates shelves for a Goodreads integration
 * @param {string} integrationId
 * @param {object} integration
 */
async function writeGoodreadsShelves(integrationId, integration) {
  const userId = integration.userId;
  const sourceId = integration.sourceId;
  const shelves = integration.shelves || [];
  const baseUrl = integration.myBooksURL || "";

  if (!userId || !sourceId || !shelves.length) {
    console.warn("⚠️ Missing required integration data");
    return;
  }

  const now = admin.firestore.FieldValue.serverTimestamp();

  for (const shelf of shelves) {
    // Find or create a shelf with this userId + integrationId + shelf
    const existing = await db
      .collection("shelves")
      .where("userId", "==", userId)
      .where("integrationId", "==", integrationId)
      .where("displayName", "==", shelf)
      .limit(1)
      .get();

    let shelfRef;
    let isNew = false;

    if (!existing.empty) {
      shelfRef = existing.docs[0].ref;
    } else {
      shelfRef = db.collection("shelves").doc(); // auto-generated ID
      isNew = true;
    }

    const shelfData = {
      shelfId: shelfRef.id,
      displayName: shelf,
      userId,
      integrationId,
      sourceId,
      shelfUrl: `${baseUrl}?shelf=${encodeURIComponent(shelfSlugMap[shelf])}`,
      updatedAt: now,
    };

    if (isNew) shelfData.createdAt = now;

    await shelfRef.set(shelfData, { merge: true });
    console.log(`📚 Shelf ${shelf} ${isNew ? "created" : "updated"}`);

    // Call item creation logic
    await createShelfItems(shelfData);
  }
}

/**
 * Placeholder for item creation logic
 */
async function createShelfItems(shelf) {
  console.log(`📦 [Mock] Creating items for shelf: ${shelf.shelfName}`);
  // We'll fill this in next!
}

module.exports = {
  writeGoodreadsShelves,
};
