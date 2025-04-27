import type { GoodreadsIntegration, GoodreadsShelf } from '../../shared/types.js';

export async function writeGoodreadsShelves(
  integrationId: string,
  _integration: GoodreadsIntegration
): Promise<void> {
  // Implementation will be added later
  console.log(`Writing Goodreads shelves for integration: ${integrationId}`);
}

export async function writeGoodreadsItems(shelfId: string, _shelf: GoodreadsShelf): Promise<void> {
  // Implementation will be added later
  console.log(`Writing Goodreads items for shelf: ${shelfId}`);
}

export async function refreshGoodreadsShelf(shelfId: string): Promise<void> {
  // Implementation will be added later
  console.log(`Refreshing Goodreads shelf: ${shelfId}`);
}
