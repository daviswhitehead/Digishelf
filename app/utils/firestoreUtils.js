import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Fetches items from Firestore by shelfId.
 * @param {string} shelfId - The ID of the shelf to fetch items for.
 * @returns {Promise<Array>} - A promise that resolves to an array of items.
 */
export const fetchItemsByShelfId = async shelfId => {
  try {
    const q = query(collection(db, 'items'), where('shelfId', '==', shelfId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching items by shelfId:', error);
    throw error;
  }
};
