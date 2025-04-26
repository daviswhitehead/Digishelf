const {
  createTestUser,
  createTestSource,
  createTestIntegration,
  createTestShelf,
  createTestItem,
  callFunction,
  cleanup,
} = require('../../../__tests__/test-utils');
const MockAdapter = require('axios-mock-adapter');
const axios = require('axios');
const { mockGoodreadsResponse } = require('./mocks');

describe('Goodreads Handlers', () => {
  const TEST_USER_ID = 'test-user-id';
  const TEST_SOURCE_ID = 'test-source-id';
  const TEST_INTEGRATION_ID = 'test-integration-id';
  const TEST_SHELF_ID = 'test-shelf-id';
  let mock;

  beforeEach(async () => {
    mock = new MockAdapter(axios);
    
    // Set up test data
    await createTestUser(TEST_USER_ID);
    await createTestSource(TEST_SOURCE_ID, {
      displayName: 'Goodreads',
      type: 'books',
    });
    await createTestIntegration(TEST_INTEGRATION_ID, TEST_USER_ID, TEST_SOURCE_ID, {
      displayName: 'Goodreads',
      myBooksURL: 'https://www.goodreads.com/review/list/12345',
      shelves: ['Want to Read', 'Currently Reading', 'Read'],
    });
  });

  afterEach(async () => {
    mock.reset();
    await cleanup({
      users: [TEST_USER_ID],
      sources: [TEST_SOURCE_ID],
      integrations: [TEST_INTEGRATION_ID],
      shelves: [TEST_SHELF_ID],
    });
  });

  describe('refreshShelf', () => {
    it('should update existing items with most recent data', async () => {
      // 1. Set up initial state
      await createTestShelf(TEST_SHELF_ID, TEST_USER_ID, TEST_SOURCE_ID, TEST_INTEGRATION_ID, {
        displayName: 'Want to Read',
        sourceDisplayName: 'Goodreads',
        originalURL: 'https://www.goodreads.com/review/list/12345?shelf=to-read',
      });

      await createTestItem('test-item-1', TEST_SHELF_ID, TEST_INTEGRATION_ID, {
        title: 'Old Title',
        author: 'Old Author',
        canonicalURL: 'https://www.goodreads.com/book/show/123',
        coverImage: 'https://example.com/old-cover.jpg',
        userRating: 3,
        userReview: 'Meh',
      });

      // 2. Mock the Goodreads API response
      const mockBooks = [
        {
          title: 'New Title',
          author: 'New Author',
          coverImage: 'https://example.com/new-cover.jpg',
          canonicalURL: 'https://www.goodreads.com/book/show/123',
          userRating: 4,
          userReview: 'Great book!',
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
      const result = await callFunction('refreshShelf', { shelfId: TEST_SHELF_ID });

      // 4. Verify the function response
      expect(result).toEqual({
        success: true,
        message: 'Shelf refreshed successfully.',
      });

      // 5. Verify the item was updated in Firestore
      const updatedItem = await db.collection('items').doc('test-item-1').get();
      expect(updatedItem.exists).toBe(true);

      const itemData = updatedItem.data();
      
      // Check that updated fields match new data
      expect(itemData.title).toBe('New Title');
      expect(itemData.author).toBe('New Author');
      expect(itemData.coverImage).toBe('https://example.com/new-cover.jpg');
      expect(itemData.userRating).toBe(4);
      expect(itemData.userReview).toBe('Great book!');
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
      expect(itemData.canonicalURL).toBe('https://www.goodreads.com/book/show/123');

      // Check timestamps
      expect(itemData.createdAt.toDate()).toEqual(expect.any(Date));
      expect(itemData.updatedAt.toDate()).toEqual(expect.any(Date));
      expect(itemData.createdAt.toDate().getTime()).toBeLessThan(
        itemData.updatedAt.toDate().getTime()
      );
    });

    // Add more test cases...
  });
}); 