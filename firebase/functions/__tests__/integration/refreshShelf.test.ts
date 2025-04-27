import {
  createTestUser,
  createTestSource,
  createTestIntegration,
  createTestShelf,
  callFunction,
  createTestItem,
  TestItem,
} from '../../test/helpers/test-utils.js';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { mockGoodreadsResponse } from '../mocks/goodreadsMock.js';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

describe('refreshShelf', () => {
  const TEST_USER_ID = 'test-user-id';
  const TEST_SOURCE_ID = 'test-source-id';
  const TEST_INTEGRATION_ID = 'test-integration-id';
  const TEST_SHELF_ID = 'test-shelf-id';
  const db = getFirestore();
  let mock: MockAdapter;

  beforeEach(async () => {
    mock = new MockAdapter(axios);
    // Set up test data
    await createTestUser(TEST_USER_ID);
    await createTestSource(TEST_SOURCE_ID);
    await createTestIntegration(TEST_INTEGRATION_ID, TEST_USER_ID, TEST_SOURCE_ID);
    await createTestShelf(TEST_SHELF_ID, TEST_USER_ID, TEST_SOURCE_ID, TEST_INTEGRATION_ID);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('Basic Shelf Refresh', () => {
    it('should update existing items with most recent data', async () => {
      const now = new Date();
      const oneDayAgo = Timestamp.fromDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));

      // 1. Set up initial state with more fields
      await createTestItem('test-item-1', TEST_SHELF_ID, TEST_INTEGRATION_ID, {
        title: 'Old Title',
        author: 'Old Author',
        canonicalURL: 'https://www.goodreads.com/book/show/123',
        coverImage: 'https://example.com/old-cover.jpg',
        rating: 'it was ok',
        review: 'Meh',
        createdAt: oneDayAgo,
        updatedAt: oneDayAgo,
        userId: TEST_USER_ID,
        sourceId: TEST_SOURCE_ID,
        sourceDisplayName: 'Goodreads',
      });

      // 2. Mock the Goodreads API response with richer data
      const mockBooks = [
        {
          title: 'New Title',
          author: 'New Author',
          coverImage: 'https://example.com/new-cover.jpg',
          canonicalURL: 'https://www.goodreads.com/book/show/123',
          rating: 'really liked it',
          review: 'Great book!',
          isbn: '1234567890',
          pageCount: 300,
          publishedYear: 2023,
          publisher: 'Test Publisher',
          language: 'English',
          genre: ['Fiction', 'Mystery'],
        },
      ];

      mock.onGet().reply(200, mockGoodreadsResponse(mockBooks));

      // 3. Call the refresh function
      const result = await callFunction<{ success: boolean; message: string }>('refreshShelf', {
        shelfId: TEST_SHELF_ID,
      });

      // 4. Verify the function response
      expect(result).toEqual({
        success: true,
        message: 'Shelf refreshed successfully.',
      });

      // 5. Verify the item was updated in Firestore with comprehensive checks
      const updatedItem: DocumentSnapshot = await db.collection('items').doc('test-item-1').get();
      expect(updatedItem.exists).toBe(true);

      const itemData = updatedItem.data() as TestItem & {
        title: string;
        author: string;
        coverImage: string;
        rating: string;
        review: string;
        isbn: string;
        pageCount: number;
        publishedYear: number;
        publisher: string;
        language: string;
        genre: string[];
        sourceDisplayName: string;
        canonicalURL: string;
      };

      // Check that updated fields match new data
      expect(itemData.title).toBe('New Title');
      expect(itemData.author).toBe('New Author');
      expect(itemData.coverImage).toBe('https://example.com/new-cover.jpg');
      expect(itemData.rating).toBe('really liked it');
      expect(itemData.review).toBe('Great book!');
      expect(itemData.isbn).toBe('1234567890');
      expect(itemData.pageCount).toBe(300);
      expect(itemData.publishedYear).toBe(2023);
      expect(itemData.publisher).toBe('Test Publisher');
      expect(itemData.language).toBe('English');
      expect(itemData.genre).toEqual(['Fiction', 'Mystery']);

      // Check that relationships are maintained
      expect(itemData.shelfId).toBe(TEST_SHELF_ID);
      expect(itemData.integrationId).toBe(TEST_INTEGRATION_ID);
      expect(itemData.userId).toBe(TEST_USER_ID);
      expect(itemData.sourceId).toBe(TEST_SOURCE_ID);
      expect(itemData.sourceDisplayName).toBe('Goodreads');
      expect(itemData.canonicalURL).toBe('https://www.goodreads.com/book/show/123');

      // Check timestamps
      const createdAtDate = itemData.createdAt.toDate();
      const updatedAtDate = itemData.updatedAt.toDate();

      expect(createdAtDate).toBeInstanceOf(Date);
      expect(updatedAtDate).toBeInstanceOf(Date);
      expect(createdAtDate.getTime()).toBeLessThan(updatedAtDate.getTime());

      // Verify the updatedAt timestamp is recent
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      expect(updatedAtDate.getTime()).toBeGreaterThan(fiveMinutesAgo.getTime());
    });

    // TODO: Implement remaining tests...
  });
});
