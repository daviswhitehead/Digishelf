import { GoodreadsIntegration, GoodreadsShelf } from '../../shared/types';

export async function writeGoodreadsShelves(
  integrationId: string,
  integration: GoodreadsIntegration
): Promise<void> {
  // Implementation will be added later
  console.log(`Writing Goodreads shelves for integration: ${integrationId}`);
}

export async function writeGoodreadsItems(shelfId: string, shelf: GoodreadsShelf): Promise<void> {
  // Implementation will be added later
  console.log(`Writing Goodreads items for shelf: ${shelfId}`);
}

export async function refreshGoodreadsShelf(shelfId: string): Promise<void> {
  // Implementation will be added later
  console.log(`Refreshing Goodreads shelf: ${shelfId}`);
} 