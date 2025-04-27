import { mockDocRef, mockCollRef } from '../../../../test/helpers/jest.setup';
import { writeGoodreadsShelves } from '../../handlers';
import { GoodreadsIntegration } from '../../../../shared/types';
import { Timestamp } from 'firebase-admin/firestore';

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => mockCollRef),
    doc: jest.fn(() => mockDocRef),
  })),
}));

describe('writeGoodreadsShelves', () => {
  const mockIntegration: GoodreadsIntegration = {
    userId: 'test-user-id',
    sourceId: 'goodreads',
    displayName: 'Test User',
    myBooksURL: 'https://www.goodreads.com/review/list/12345',
    profileUrl: 'https://www.goodreads.com/user/show/12345',
    active: true,
    shelves: ['read', 'currently-reading', 'to-read'],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should write integration data to Firestore', async () => {
    await writeGoodreadsShelves('test-integration-id', mockIntegration);

    // Verify that Firestore operations were called correctly
    expect(mockCollRef.doc).toHaveBeenCalledWith('test-integration-id');
    expect(mockDocRef.set).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'test-user-id',
        sourceId: 'goodreads',
        displayName: 'Test User',
        myBooksURL: 'https://www.goodreads.com/review/list/12345',
        profileUrl: 'https://www.goodreads.com/user/show/12345',
        active: true,
        shelves: ['read', 'currently-reading', 'to-read'],
      })
    );
  });

  it('should handle errors gracefully', async () => {
    // Mock a Firestore error
    mockDocRef.set.mockRejectedValueOnce(new Error('Firestore error'));

    await expect(writeGoodreadsShelves('test-integration-id', mockIntegration)).rejects.toThrow(
      'Firestore error'
    );
  });
});
