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
  console.log('Creating doc ref for path:', path);
  const docRef = {
    id: path.split('/').pop() || '',
    path,
    collection: jest
      .fn(collectionPath => {
        console.log('Doc collection called with:', collectionPath);
        return createMockCollRef(`${path}/${collectionPath}`);
      })
      .mockName('docCollection'),
    get: mockGet,
    set: mockSet,
    update: mockUpdate,
    delete: mockDelete,
    parent: null,
  } as unknown as DocumentReference;
  console.log('Created doc ref:', docRef);
  return docRef;
}

// Mock collection reference factory function
function createMockCollRef(path: string): CollectionReference {
  console.log('Creating collection ref for path:', path);
  const collRef = {
    id: path.split('/').pop() || '',
    path,
    get: mockGet,
    where: mockWhere.mockReturnThis(),
    orderBy: mockOrderBy.mockReturnThis(),
    limit: mockLimit.mockReturnThis(),
    parent: null,
  } as unknown as CollectionReference;

  // Add doc method directly to the collection reference
  collRef.doc = jest
    .fn((docPath?: string) => {
      console.log('Collection doc called with:', docPath);
      const fullPath = docPath
        ? `${path}/${docPath}`
        : `${path}/${Math.random().toString(36).substring(7)}`;
      return createMockDocRef(fullPath);
    })
    .mockName('collectionDoc');

  console.log('Created collection ref:', collRef);
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
const collectionMock = jest.fn((path: string) => {
  console.log('Collection mock called with:', path);
  const collRef = createMockCollRef(path);
  console.log('Collection mock returning:', collRef);
  return collRef;
});

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

// Verify the setup
console.log('Collection mock implementation:', collectionMock.getMockImplementation());
console.log('Initialized db with collection method:', !!db.collection);

// Clean up after each test
afterEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(async () => {
  await app.delete();
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
