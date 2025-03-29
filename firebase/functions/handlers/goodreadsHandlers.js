const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const { findOrCreateItem } = require("../utils/firestoreHelpers");
const { getAllPages } = require("../data/goodreadsData");

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
  const baseURL = integration.myBooksURL || "";

  if (!userId || !sourceId || !shelves.length) {
    console.warn("⚠️ Missing required integration data");
    return;
  }

  const now = FieldValue.serverTimestamp();

  for (const shelf of shelves) {
    // // TEMP
    // if (shelf !== "Currently Reading") {
    //   console.log(`Skipping shelf ${shelf}`);
    //   continue;
    // }

    // Find or create a shelf with this userId + integrationId + displayName
    const existing = await admin
      .firestore()
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
      shelfRef = admin.firestore().collection("shelves").doc(); // auto-generated ID
      isNew = true;
    }

    const shelfData = {
      shelfId: shelfRef.id,
      displayName: shelf,
      userId,
      integrationId,
      sourceId,
      shelfURL: `${baseURL}?shelf=${encodeURIComponent(shelfSlugMap[shelf])}`,
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
 * Creates or updates shelves for a Goodreads integration
 * @param {object} shelf
 */
async function createShelfItems(shelf) {
  const { shelfId, userId, integrationId, sourceId, shelfURL } = shelf;

  const allBooks = await getAllPages(shelfURL);

  for (const book of allBooks) {
    await findOrCreateItem({
      shelfId,
      userId,
      integrationId,
      sourceId,
      ...book,
    });
  }
}

module.exports = {
  writeGoodreadsShelves,
};
