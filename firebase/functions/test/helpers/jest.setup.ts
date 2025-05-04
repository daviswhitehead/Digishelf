/* global afterEach, afterAll */

import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type {
  Firestore,
  CollectionReference,
  DocumentReference,
  WriteResult,
  DocumentSnapshot,
} from 'firebase-admin/firestore';

// Import custom matchers
import './matchers/firestore';

// Mock environment variables
process.env = {
  ...process.env,
  FIRESTORE_EMULATOR_HOST: 'localhost:8081',
  FIREBASE_FUNCTIONS_EMULATOR_HOST: 'localhost:5001',
  FIREBASE_PROJECT_ID: 'demo-test',
  NODE_ENV: 'test',
} as NodeJS.ProcessEnv;

// Initialize Firebase Admin with a mock app
const app = admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
});

// Create base mock functions with logging
const mockGet = jest.fn().mockName('mockGet');
const mockSet = jest.fn().mockName('mockSet');
const mockUpdate = jest.fn().mockName('mockUpdate');
const mockDelete = jest.fn().mockName('mockDelete');
const mockWhere = jest.fn().mockName('mockWhere');
const mockOrderBy = jest.fn().mockName('mockOrderBy');
const mockLimit = jest.fn().mockName('mockLimit');

// Mock document reference factory function
function createMockDocRef(path: string): DocumentReference {
  const docRef = {
    id: path.split('/').pop() || '',
    path,
    collection: jest
      .fn(collectionPath => createMockCollRef(`${path}/${collectionPath}`))
      .mockName('docCollection'),
    get: mockGet,
    set: mockSet,
    update: mockUpdate,
    delete: mockDelete,
    parent: null,
  } as unknown as DocumentReference;
  return docRef;
}

// Mock collection reference factory function
function createMockCollRef(path: string): CollectionReference {
  const collRef = {
    id: path.split('/').pop() || '',
    path,
    get: mockGet,
    where: mockWhere.mockReturnThis(),
    orderBy: mockOrderBy.mockReturnThis(),
    limit: mockLimit.mockReturnThis(),
    parent: null,
    add: jest.fn().mockResolvedValue({ id: 'mock-doc-id' }),
  } as unknown as CollectionReference;

  // Add doc method directly to the collection reference
  collRef.doc = jest
    .fn((docPath?: string) => {
      const fullPath = docPath
        ? `${path}/${docPath}`
        : `${path}/${Math.random().toString(36).substring(7)}`;
      return createMockDocRef(fullPath);
    })
    .mockName('collectionDoc');

  return collRef;
}

// Set up default mock implementations for document operations
mockGet.mockImplementation(() =>
  Promise.resolve({
    exists: true,
    id: 'test-doc-id',
    data: () => ({ id: 'test-doc-id' }),
    ref: createMockDocRef('test/test-doc-id'),
    get: jest.fn(),
    isEqual: jest.fn(),
    readTime: Timestamp.now(),
  } as unknown as DocumentSnapshot)
);

mockSet.mockImplementation(() =>
  Promise.resolve({
    writeTime: Timestamp.now(),
  } as WriteResult)
);

mockUpdate.mockImplementation(() =>
  Promise.resolve({
    writeTime: Timestamp.now(),
  } as WriteResult)
);

mockDelete.mockImplementation(() =>
  Promise.resolve({
    writeTime: Timestamp.now(),
  } as WriteResult)
);

// Create collection mock with implementation first
const collectionMock = jest.fn((path: string) => createMockCollRef(path));

// Create batch mock
const batchMock = jest.fn(() => ({
  set: jest.fn().mockName('batchSet'),
  update: jest.fn().mockName('batchUpdate'),
  delete: jest.fn().mockName('batchDelete'),
  commit: jest.fn().mockResolvedValue(undefined).mockName('batchCommit'),
}));

// Create transaction mock
const transactionMock = jest.fn().mockName('runTransaction');

// Create the mock Firestore instance using our pre-configured mocks
const mockFirestore = {
  collection: collectionMock,
  batch: batchMock,
  runTransaction: transactionMock,
} as unknown as Firestore;

// Mock the admin.firestore() call
jest.spyOn(admin, 'firestore').mockImplementation(() => mockFirestore);

// Export the mock Firestore instance
const db = mockFirestore;

// Clean up after each test
afterEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  // Clear any console mocks that might have been set up
  jest.restoreAllMocks();
});

// Clean up after all tests
afterAll(async () => {
  await Promise.all([
    app.delete(),
    // Add any other cleanup promises here
  ]);
});

export {
  db,
  createMockDocRef,
  createMockCollRef,
  mockFirestore,
  mockGet,
  mockSet,
  mockUpdate,
  mockDelete,
  mockWhere,
  mockOrderBy,
  mockLimit,
};
