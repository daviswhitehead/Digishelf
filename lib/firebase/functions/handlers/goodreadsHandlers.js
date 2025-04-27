"use strict";
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
const { getAllPages } = require('../data/goodreadsData');
const shelfSlugMap = {
    All: 'all',
    Read: 'read',
    'Currently Reading': 'currently-reading',
    'Want to Read': 'to-read',
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
    const baseURL = integration.myBooksURL || '';
    if (!userId || !sourceId || !shelves.length || !baseURL.length) {
        console.error(`🐛 Missing required integration data: ${integrationId}`);
        return;
    }
    const now = FieldValue.serverTimestamp();
    const batch = admin.firestore().batch(); // Initialize a Firestore batch
    for (const shelf of shelves) {
        // // TEMP
        // if (shelf !== "Currently Reading") {
        //   console.info(`Skipping shelf ${shelf}`);
        //   continue;
        // }
        // Find or create a shelf with this userId + integrationId + displayName
        const existing = await admin
            .firestore()
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
        }
        else {
            shelfRef = admin.firestore().collection('shelves').doc(); // auto-generated ID
            isNew = true;
        }
        const shelfData = {
            shelfId: shelfRef.id,
            userId,
            sourceId,
            integrationId,
            sourceDisplayName: integration.displayName,
            displayName: shelf,
            originalURL: `${baseURL}?shelf=${encodeURIComponent(shelfSlugMap[shelf])}`,
            updatedAt: now,
        };
        if (isNew)
            shelfData.createdAt = now;
        batch.set(shelfRef, shelfData, { merge: true });
        console.info(`📚 Shelf "${shelf}" ${isNew ? 'batched for creation' : 'batched for update'}: ${shelfRef.id}`);
    }
    // Commit the batch
    await batch.commit();
    console.info(`✅ All shelves batch written for integration: ${integrationId}`);
}
/**
 * Creates or updates shelves for a Goodreads integration
 * @param {string} shelfId - The shelf ID
 * @param {object} shelf - The shelf object containing details about the shelf
 */
async function writeGoodreadsItems(shelfId, shelf) {
    console.time(`writeGoodreadsItems-${shelfId}`);
    const { integrationId, userId, sourceId, originalURL } = shelf;
    console.info(`📚 Fetching books from: ${originalURL}`);
    const allBooks = await getAllPages(originalURL);
    console.info(`📚 Found ${allBooks.length} books to process`);
    const now = FieldValue.serverTimestamp();
    let batch = admin.firestore().batch();
    let operationCount = 0;
    let totalProcessed = 0;
    for (const book of allBooks) {
        const existing = await admin
            .firestore()
            .collection('items')
            .where('shelfId', '==', shelfId)
            .where('canonicalURL', '==', book.canonicalURL)
            .limit(1)
            .get();
        let itemRef;
        let isNew = false;
        if (!existing.empty) {
            itemRef = existing.docs[0].ref;
        }
        else {
            itemRef = admin.firestore().collection('items').doc();
            isNew = true;
        }
        const itemData = Object.assign(Object.assign({ itemId: itemRef.id, shelfId,
            integrationId,
            userId,
            sourceId }, book), { updatedAt: now });
        if (isNew)
            itemData.createdAt = now;
        batch.set(itemRef, itemData, { merge: true });
        operationCount++;
        totalProcessed++;
        // Commit the batch if it reaches 500 operations
        if (operationCount === 500) {
            await batch.commit();
            console.info(`✅ Committed batch of 500 items for shelf: ${shelfId} (${totalProcessed}/${allBooks.length} total)`);
            batch = admin.firestore().batch(); // Start a new batch
            operationCount = 0;
        }
    }
    // Commit any remaining operations
    if (operationCount > 0) {
        await batch.commit();
        console.info(`✅ Committed remaining ${operationCount} items for shelf: ${shelfId} (${totalProcessed}/${allBooks.length} total)`);
    }
    console.timeEnd(`writeGoodreadsItems-${shelfId}`);
}
/**
 * Refreshes a Goodreads shelf by fetching the latest data and updating Firestore.
 * @param {string} shelfId - The shelf ID.
 */
async function refreshGoodreadsShelf(shelfId) {
    console.time(`refreshGoodreadsShelf-${shelfId}`);
    const shelfDoc = await admin.firestore().collection('shelves').doc(shelfId).get();
    if (!shelfDoc.exists) {
        throw new Error(`Shelf not found: ${shelfId}`);
    }
    const shelf = shelfDoc.data();
    const { originalURL } = shelf;
    if (!originalURL) {
        throw new Error(`Shelf URL is missing for shelfId: ${shelfId}`);
    }
    console.info(`🔄 Refreshing Goodreads shelf: ${shelfId}`);
    console.info(`📚 Fetching books from: ${originalURL}`);
    try {
        await writeGoodreadsItems(shelfId, shelf);
        console.info(`✅ Successfully refreshed Goodreads shelf: ${shelfId}`);
    }
    catch (error) {
        console.error(`❌ Failed to refresh shelf ${shelfId}:`, error);
        throw error;
    }
    finally {
        console.timeEnd(`refreshGoodreadsShelf-${shelfId}`);
    }
}
module.exports = {
    writeGoodreadsShelves,
    writeGoodreadsItems,
    refreshGoodreadsShelf,
};
//# sourceMappingURL=goodreadsHandlers.js.map