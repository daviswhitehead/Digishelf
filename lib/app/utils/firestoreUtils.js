"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchItemsByShelfId = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("./firebase");
/**
 * Fetches items from Firestore by shelfId.
 * @param {string} shelfId - The ID of the shelf to fetch items for.
 * @returns {Promise<Array>} - A promise that resolves to an array of items.
 */
const fetchItemsByShelfId = async (shelfId) => {
    try {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'items'), (0, firestore_1.where)('shelfId', '==', shelfId));
        const querySnapshot = await (0, firestore_1.getDocs)(q);
        return querySnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    }
    catch (error) {
        console.error('Error fetching items by shelfId:', error);
        throw error;
    }
};
exports.fetchItemsByShelfId = fetchItemsByShelfId;
//# sourceMappingURL=firestoreUtils.js.map