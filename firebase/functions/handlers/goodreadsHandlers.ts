import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAllPages } from '../data/goodreadsData.js';
import { GoodreadsIntegration, GoodreadsShelf } from '../shared/types';

const shelfSlugMap = {
  All: 'all',
  Read: 'read',
  'Currently Reading': 'currently-reading',
  'Want to Read': 'to-read',
} as const;

type ShelfName = keyof typeof shelfSlugMap;

/**
 * Creates or updates shelves for a Goodreads integration
 */
export async function writeGoodreadsShelves(
  integrationId: string,
  integration: GoodreadsIntegration
): Promise<void> {
  const { userId, sourceId, shelves, myBooksURL: baseURL } = integration;

  if (!userId || !sourceId || !shelves.length || !baseURL) {
    console.error(`🐛 Missing required integration data: ${integrationId}`);
    return;
  }

  const now = FieldValue.serverTimestamp();
  const db = getFirestore();
  const batch = db.batch();

  for (const shelf of shelves) {
    // // TEMP
    // if (shelf !== "Currently Reading") {
    //   console.info(`Skipping shelf ${shelf}`);
    //   continue;
    // }

    // Find or create a shelf with this userId + integrationId + displayName
    const existing = await db
      .collection('shelves')
      .where('userId', '==', userId)
      .where('integrationId', '==', integrationId)
      .where('displayName', '==', shelf)
      .limit(1)
      .get();

    let shelfRef;
    let isNew = false;

    if (!existing.empty) {
      shelfRef = existing.docs[0].ref;
    } else {
      shelfRef = db.collection('shelves').doc(); // auto-generated ID
      isNew = true;
    }

    const shelfData = {
      shelfId: shelfRef.id,
      userId,
      sourceId,
      integrationId,
      sourceDisplayName: integration.displayName,
      displayName: shelf,
      originalURL: `${baseURL}?shelf=${encodeURIComponent(shelfSlugMap[shelf as ShelfName])}`,
      updatedAt: now,
    };

    if (isNew) {
      (shelfData as typeof shelfData & { createdAt: typeof now }).createdAt = now;
    }

    batch.set(shelfRef, shelfData, { merge: true });
    console.info(
      `📚 Shelf "${shelf}" ${isNew ? 'batched for creation' : 'batched for update'}: ${shelfRef.id}`
    );
  }

  // Commit the batch
  await batch.commit();
  console.info(`✅ All shelves batch written for integration: ${integrationId}`);
}

/**
 * Creates or updates items for a Goodreads shelf
 */
export async function writeGoodreadsItems(shelfId: string, shelf: GoodreadsShelf): Promise<void> {
  console.time(`writeGoodreadsItems-${shelfId}`);

  const { integrationId, userId, sourceId, originalURL } = shelf;
  console.info(`📚 Fetching books from: ${originalURL}`);

  const allBooks = await getAllPages(originalURL);
  if (!allBooks) {
    throw new Error(`Failed to fetch books from ${originalURL}`);
  }

  console.info(`📚 Found ${allBooks.length} books to process`);

  const now = FieldValue.serverTimestamp();
  const db = getFirestore();
  let batch = db.batch();
  let operationCount = 0;
  let totalProcessed = 0;

  for (const book of allBooks) {
    const existing = await db
      .collection('items')
      .where('shelfId', '==', shelfId)
      .where('canonicalURL', '==', book.canonicalURL)
      .limit(1)
      .get();

    let itemRef;
    let isNew = false;

    if (!existing.empty) {
      itemRef = existing.docs[0].ref;
    } else {
      itemRef = db.collection('items').doc();
      isNew = true;
    }

    const itemData = {
      itemId: itemRef.id,
      shelfId,
      integrationId,
      userId,
      sourceId,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      canonicalURL: book.canonicalURL,
      rating: book.userRating,
      review: book.userReview,
      primaryColor: book.primaryColor,
      updatedAt: now,
    };

    if (isNew) {
      (itemData as typeof itemData & { createdAt: typeof now }).createdAt = now;
    }

    batch.set(itemRef, itemData, { merge: true });
    operationCount++;
    totalProcessed++;

    // Commit the batch if it reaches 500 operations
    if (operationCount === 500) {
      await batch.commit();
      console.info(
        `✅ Committed batch of 500 items for shelf: ${shelfId} (${totalProcessed}/${allBooks.length} total)`
      );
      batch = db.batch(); // Start a new batch
      operationCount = 0;
    }
  }

  // Commit any remaining operations
  if (operationCount > 0) {
    await batch.commit();
    console.info(
      `✅ Committed remaining ${operationCount} items for shelf: ${shelfId} (${totalProcessed}/${allBooks.length} total)`
    );
  }

  console.timeEnd(`writeGoodreadsItems-${shelfId}`);
}

/**
 * Refreshes a Goodreads shelf by fetching the latest data and updating Firestore.
 */
export async function refreshGoodreadsShelf(shelfId: string): Promise<void> {
  console.time(`refreshGoodreadsShelf-${shelfId}`);

  const db = getFirestore();
  const shelfDoc = await db.collection('shelves').doc(shelfId).get();

  if (!shelfDoc.exists) {
    throw new Error(`Shelf not found: ${shelfId}`);
  }

  const shelf = shelfDoc.data() as GoodreadsShelf;
  const { originalURL } = shelf;

  if (!originalURL) {
    throw new Error(`Shelf URL is missing for shelfId: ${shelfId}`);
  }

  console.info(`🔄 Refreshing Goodreads shelf: ${shelfId}`);
  console.info(`📚 Fetching books from: ${originalURL}`);

  try {
    await writeGoodreadsItems(shelfId, shelf);
    console.info(`✅ Successfully refreshed Goodreads shelf: ${shelfId}`);
  } catch (error) {
    console.error(`❌ Failed to refresh shelf ${shelfId}:`, error);
    throw error;
  } finally {
    console.timeEnd(`refreshGoodreadsShelf-${shelfId}`);
  }
}
