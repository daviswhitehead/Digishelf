const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const { findOrCreateItem } = require("../utils/firestoreHelpers");

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

  const now = FieldValue.serverTimestamp();

  for (const shelf of shelves) {
    // Find or create a shelf with this userId + integrationId + shelf
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
 * Creates or updates shelves for a Goodreads integration
 * @param {object} shelf
 */
async function createShelfItems(shelf) {
  const { shelfId, userId, integrationId, sourceId } = shelf;

  // Example placeholder items — you can customize these per shelfName if you want
  const mockItems = [
    {
      title: "The Inner Game of Tennis",
      author: "W. Timothy Gallwey",
      coverImage: "https://m.media-amazon.com/images/I/71+1CgqvXSL.jpg",
      URL: "inner game of tennis",
      userRating: 4,
      userReview:
        "Overall, I thought this book was a little overhyped, but I enjoyed learning about person 1 and person 2. Overall, I thought this book was a little overhyped, but I enjoyed learning about person 1 and person 2. Overall, I thought this book was a little overhyped, but I enjoyed learning about person 1 and person 2...",
      sourceRating: 4.6,
      sourceReviewsCount: 86747,
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      coverImage: "https://m.media-amazon.com/images/I/81ANaVZk5LL.jpg",
      URL: "atomic habits",
      userRating: 5,
      userReview:
        "One of the best books on building habits and making small improvements in daily life...",
      sourceRating: 4.1,
      sourceReviewsCount: 231234,
    },
  ];

  for (const item of mockItems) {
    await findOrCreateItem({
      shelfId,
      userId,
      integrationId,
      sourceId,
      ...item,
    });
  }
}

module.exports = {
  writeGoodreadsShelves,
};
