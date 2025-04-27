import { writeGoodreadsShelves } from '../../handlers.js';
import { GoodreadsIntegration } from '../../../../shared/types/index.js';
import { Timestamp } from 'firebase-admin/firestore';

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
  });

  it('should log the integration ID', async () => {
    const integrationId = 'test-integration-id';
    await writeGoodreadsShelves(integrationId, mockIntegration);
    expect(console.log).toHaveBeenCalledWith(
      `Writing Goodreads shelves for integration: ${integrationId}`
    );
  });
});
