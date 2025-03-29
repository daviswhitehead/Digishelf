const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

/**
 * This function:
	•	Looks for an existing item by unique properties (e.g. shelfId + title)
	•	If found, updates it
	•	If not, creates it
 * @param {string} shelfId
 * @param {string} URL
 * @param {object} rest
 */
async function findOrCreateItem({ shelfId, URL, ...rest }) {
  const now = FieldValue.serverTimestamp();

  const existingQuery = await admin
    .firestore()
    .collection("items")
    .where("shelfId", "==", shelfId)
    .where("URL", "==", URL)
    .limit(1)
    .get();

  let itemRef;
  let isNew = false;

  if (!existingQuery.empty) {
    itemRef = existingQuery.docs[0].ref;
  } else {
    itemRef = admin.firestore().collection("items").doc();
    isNew = true;
  }

  const itemData = {
    itemId: itemRef.id,
    shelfId,
    URL,
    updatedAt: now,
    ...rest,
  };

  if (isNew) itemData.createdAt = now;

  await itemRef.set(itemData, { merge: true });

  console.log(`${isNew ? "➕ Created" : "🔄 Updated"} item: ${URL}`);
}

module.exports = {
  findOrCreateItem,
};
