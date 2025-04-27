import * as admin from 'firebase-admin';
import { db } from './jest.setup.js';
import type { DocumentData } from 'firebase-admin/firestore';
import type { CallableRequest } from 'firebase-functions/v2/https';
import { handleRefreshShelf } from '../../handlers/refreshShelf.js';
import type { RefreshShelfData, RefreshShelfResponse } from '../../handlers/refreshShelf.js';
import type { Request } from 'firebase-functions/v2/https';

interface TestUser extends DocumentData {
  userId: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

interface TestSource extends DocumentData {
  sourceId: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

interface TestIntegration extends DocumentData {
  integrationId: string;
  userId: string;
  sourceId: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

interface TestShelf extends DocumentData {
  shelfId: string;
  userId: string;
  sourceId: string;
  integrationId: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

interface TestItem extends DocumentData {
  itemId: string;
  shelfId: string;
  integrationId: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

interface CleanupCollections {
  users?: string[];
  sources?: string[];
  integrations?: string[];
  shelves?: string[];
  items?: string[];
}

/**
 * Creates a test user document
 */
async function createTestUser(userId: string, data: Partial<TestUser> = {}): Promise<void> {
  console.log('createTestUser called with userId:', userId);
  console.log('db object:', db);
  console.log('db.collection:', db.collection);
  const userRef = db.collection('users').doc(userId);
  console.log('userRef:', userRef);
  await userRef.set({
    userId,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    ...data,
  });
}

/**
 * Creates a test source document
 */
async function createTestSource(sourceId: string, data: Partial<TestSource> = {}): Promise<void> {
  const sourceRef = db.collection('sources').doc(sourceId);
  await sourceRef.set({
    sourceId,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    ...data,
  });
}

/**
 * Creates a test integration document
 */
async function createTestIntegration(
  integrationId: string,
  userId: string,
  sourceId: string,
  data: Partial<TestIntegration> = {}
): Promise<void> {
  const integrationRef = db.collection('integrations').doc(integrationId);
  await integrationRef.set({
    integrationId,
    userId,
    sourceId,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    ...data,
  });
}

/**
 * Creates a test shelf document
 */
async function createTestShelf(
  shelfId: string,
  userId: string,
  sourceId: string,
  integrationId: string,
  data: Partial<TestShelf> = {}
): Promise<void> {
  const shelfRef = db.collection('shelves').doc(shelfId);
  await shelfRef.set({
    shelfId,
    userId,
    sourceId,
    integrationId,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    ...data,
  });
}

/**
 * Creates a test item document
 */
async function createTestItem(
  itemId: string,
  shelfId: string,
  integrationId: string,
  data: Partial<TestItem> = {}
): Promise<void> {
  const itemRef = db.collection('items').doc(itemId);
  await itemRef.set({
    itemId,
    shelfId,
    integrationId,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    ...data,
  });
}

/**
 * Calls a Firebase function
 */
async function callFunction(
  name: 'refreshShelf',
  data: RefreshShelfData
): Promise<RefreshShelfResponse> {
  const mockRequest: CallableRequest<RefreshShelfData> = {
    data,
    auth: undefined,
    rawRequest: {} as Request,
    acceptsStreaming: false,
  };

  return handleRefreshShelf(mockRequest);
}

/**
 * Cleans up test data
 */
async function cleanup(collections: CleanupCollections = {}): Promise<void> {
  const { users = [], sources = [], integrations = [], shelves = [], items = [] } = collections;

  const batch = db.batch();

  users.forEach(id => {
    const ref = db.collection('users').doc(id);
    batch.delete(ref);
  });

  sources.forEach(id => {
    const ref = db.collection('sources').doc(id);
    batch.delete(ref);
  });

  integrations.forEach(id => {
    const ref = db.collection('integrations').doc(id);
    batch.delete(ref);
  });

  shelves.forEach(id => {
    const ref = db.collection('shelves').doc(id);
    batch.delete(ref);
  });

  items.forEach(id => {
    const ref = db.collection('items').doc(id);
    batch.delete(ref);
  });

  await batch.commit();
}

export {
  createTestUser,
  createTestSource,
  createTestIntegration,
  createTestShelf,
  createTestItem,
  callFunction,
  cleanup,
  type TestUser,
  type TestSource,
  type TestIntegration,
  type TestShelf,
  type TestItem,
  type CleanupCollections,
  db,
};
