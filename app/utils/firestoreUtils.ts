import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase/clientApp';
import type { Book } from '../types/book';

/**
 * Fetches items from Firestore by shelfId.
 * @param {string} shelfId - The ID of the shelf to fetch items for.
 * @returns {Promise<Array>} - A promise that resolves to an array of items.
 */
export const fetchItemsByShelfId = async (shelfId: string): Promise<Book[]> => {
  try {
    const itemsRef = collection(db, 'shelves', shelfId, 'items');
    const q = query(itemsRef);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};
