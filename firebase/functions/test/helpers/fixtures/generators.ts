import { createTimestamp } from '../mocks/firebase';
import type { TestUser, TestSource, TestIntegration, TestShelf, TestItem } from '../test-utils';

/**
 * Generates a test user with optional overrides
 */
export function generateTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const now = createTimestamp();
  return {
    userId: `user_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Generates a test source with optional overrides
 */
export function generateTestSource(overrides: Partial<TestSource> = {}): TestSource {
  const now = createTimestamp();
  return {
    sourceId: `source_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Generates a test integration with optional overrides
 */
export function generateTestIntegration(
  userId: string,
  sourceId: string,
  overrides: Partial<TestIntegration> = {}
): TestIntegration {
  const now = createTimestamp();
  return {
    integrationId: `integration_${Date.now()}`,
    userId,
    sourceId,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Generates a test shelf with optional overrides
 */
export function generateTestShelf(
  userId: string,
  sourceId: string,
  integrationId: string,
  overrides: Partial<TestShelf> = {}
): TestShelf {
  const now = createTimestamp();
  return {
    shelfId: `shelf_${Date.now()}`,
    userId,
    sourceId,
    integrationId,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Generates a test item with optional overrides
 */
export function generateTestItem(
  shelfId: string,
  integrationId: string,
  overrides: Partial<TestItem> = {}
): TestItem {
  const now = createTimestamp();
  return {
    itemId: `item_${Date.now()}`,
    shelfId,
    integrationId,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Generates a complete test data set
 */
export function generateTestDataSet(count: number = 1) {
  const user = generateTestUser();
  const source = generateTestSource();
  const integration = generateTestIntegration(user.userId, source.sourceId);
  const shelves = Array.from({ length: count }, () =>
    generateTestShelf(user.userId, source.sourceId, integration.integrationId)
  );
  const items = shelves.flatMap(shelf =>
    Array.from({ length: count }, () =>
      generateTestItem(shelf.shelfId, integration.integrationId)
    )
  );

  return {
    user,
    source,
    integration,
    shelves,
    items,
  };
} 