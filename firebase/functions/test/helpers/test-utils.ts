import * as admin from 'firebase-admin';
import { getFunctions, type HttpsCallable } from 'firebase-admin/functions';
import { db } from './jest.setup';
import type { DocumentData } from 'firebase-admin/firestore';

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
  await db
    .collection('users')
    .doc(userId)
    .set({
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    });
}

/**
 * Creates a test source document
 */
async function createTestSource(sourceId: string, data: Partial<TestSource> = {}): Promise<void> {
  await db
    .collection('sources')
    .doc(sourceId)
    .set({
      sourceId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
  await db
    .collection('integrations')
    .doc(integrationId)
    .set({
      integrationId,
      userId,
      sourceId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
  await db
    .collection('shelves')
    .doc(shelfId)
    .set({
      shelfId,
      userId,
      sourceId,
      integrationId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
  await db
    .collection('items')
    .doc(itemId)
    .set({
      itemId,
      shelfId,
      integrationId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    });
}

/**
 * Calls a Firebase function
 */
async function callFunction<T = any>(name: string, data: any): Promise<T> {
  const functions = getFunctions();
  const callable = functions.httpsCallable(name) as HttpsCallable;
  const result = await callable(data);
  return result.data;
}

/**
 * Cleans up test data
 */
async function cleanup(collections: CleanupCollections = {}): Promise<void> {
  const { users = [], sources = [], integrations = [], shelves = [], items = [] } = collections;

  const batch = db.batch();

  users.forEach(id => batch.delete(db.collection('users').doc(id)));
  sources.forEach(id => batch.delete(db.collection('sources').doc(id)));
  integrations.forEach(id => batch.delete(db.collection('integrations').doc(id)));
  shelves.forEach(id => batch.delete(db.collection('shelves').doc(id)));
  items.forEach(id => batch.delete(db.collection('items').doc(id)));

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
};
