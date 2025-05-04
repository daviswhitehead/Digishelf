import { writeGoodreadsShelves } from '../../handlers.js';
import { GoodreadsIntegration } from '../../../../shared/types/index.js';
import { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../../../test/helpers/jest.setup.js';
import type { CollectionReference } from 'firebase-admin/firestore';

describe('writeGoodreadsShelves', () => {
  const mockIntegration: GoodreadsIntegration = {
    integrationId: 'test-integration-id',
    userId: 'test-user-id',
    sourceId: 'goodreads',
    displayName: 'Test User',
    myBooksURL: 'https://www.goodreads.com/review/list/12345',
    shelves: ['read', 'currently-reading', 'to-read'],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log the integration ID', async () => {
    const integrationId = 'test-integration-id';

    // Create a mock collection reference that returns a mock document
    const mockCollectionAdd = jest.fn().mockResolvedValue({ id: 'test-log-id' });
    const mockCollection = jest.spyOn(db, 'collection').mockReturnValue({
      add: mockCollectionAdd,
    } as Partial<CollectionReference> as CollectionReference);

    await writeGoodreadsShelves(integrationId, mockIntegration, db);

    expect(console.log).toHaveBeenCalledWith(
      `Writing Goodreads shelves for integration: ${integrationId}`
    );
    expect(mockCollection).toHaveBeenCalledWith('logs');
    expect(mockCollectionAdd).toHaveBeenCalledWith({
      type: 'goodreads_shelves_write',
      integrationId,
      timestamp: expect.any(Date),
    });
  }, 30000); // Increased timeout to 30s for CI environment
});
