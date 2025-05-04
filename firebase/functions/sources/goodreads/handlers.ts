import type { Firestore } from 'firebase-admin/firestore';
import type { GoodreadsIntegration, GoodreadsShelf } from '../../shared/types/index.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { db as defaultDb } from '../../utils/firebase';

export async function writeGoodreadsShelves(
  integrationId: string,
  integration: GoodreadsIntegration,
  db: Firestore = defaultDb
): Promise<void> {
  // Implementation will be added later
  console.log(`Writing Goodreads shelves for integration: ${integrationId}`);
  console.debug('Integration details:', integration);
  await db.collection('logs').add({
    type: 'goodreads_shelves_write',
    integrationId,
    timestamp: new Date(),
  });
}

export async function writeGoodreadsItems(
  shelfId: string,
  shelf: GoodreadsShelf,
  db: Firestore = defaultDb
): Promise<void> {
  // Implementation will be added later
  console.log(`Writing Goodreads items for shelf: ${shelfId}`, shelf);
  await db.collection('logs').add({
    type: 'goodreads_items_write',
    shelfId,
    timestamp: new Date(),
  });
}

export async function refreshGoodreadsShelf(
  shelfId: string,
  db: Firestore = defaultDb
): Promise<void> {
  console.log(`Refreshing Goodreads shelf: ${shelfId}`);

  // 1. Get the shelf document to get the integration details
  const shelfDoc = await db.collection('shelves').doc(shelfId).get();
  if (!shelfDoc.exists) {
    throw new Error(`Shelf not found: ${shelfId}`);
  }

  const shelfData = shelfDoc.data() as GoodreadsShelf;
  const { originalURL } = shelfData;

  if (!originalURL) {
    throw new Error(`No original URL found for shelf: ${shelfId}`);
  }

  // 2. Fetch updated data from Goodreads
  const response = await axios.get(originalURL);
  const $ = cheerio.load(response.data);

  // 3. Parse the books from the HTML
  const books = $('.bookalike.review')
    .map((_, el) => {
      const $el = $(el);
      return {
        title: $el.find('.field.title a').text().trim(),
        author: $el.find('.field.author a').text().trim(),
        coverImage: $el.find('.field.cover img').attr('src'),
        canonicalURL: $el.find('.field.title a').attr('href'),
        rating: $el.find('.field.rating .staticStars').attr('title'),
        review: $el.find('.field.review span').text().trim(),
        isbn: $el.find('.field.isbn span').text().trim(),
        pageCount: parseInt($el.find('.field.pageCount span').text().trim(), 10) || undefined,
        publishedYear:
          parseInt($el.find('.field.publishedYear span').text().trim(), 10) || undefined,
        publisher: $el.find('.field.publisher span').text().trim(),
        language: $el.find('.field.language span').text().trim(),
        genre: $el.find('.field.genre span').text().trim().split(', ').filter(Boolean),
      };
    })
    .get();

  // 4. Get all items for this shelf
  const itemsSnapshot = await db.collection('items').where('shelfId', '==', shelfId).get();

  // 5. Update each item with new data
  const batch = db.batch();
  const now = new Date();

  for (const itemDoc of itemsSnapshot.docs) {
    const itemData = itemDoc.data();
    const canonicalURL = itemData.canonicalURL;

    // Find matching book in the parsed books
    const updatedBook = books.find(book => book.canonicalURL === canonicalURL);
    if (updatedBook) {
      batch.update(itemDoc.ref, {
        title: updatedBook.title,
        author: updatedBook.author,
        coverImage: updatedBook.coverImage,
        rating: updatedBook.rating,
        review: updatedBook.review,
        isbn: updatedBook.isbn,
        pageCount: updatedBook.pageCount,
        publishedYear: updatedBook.publishedYear,
        publisher: updatedBook.publisher,
        language: updatedBook.language,
        genre: updatedBook.genre,
        updatedAt: now,
      });
    }
  }

  // 6. Commit all updates
  await batch.commit();
}
