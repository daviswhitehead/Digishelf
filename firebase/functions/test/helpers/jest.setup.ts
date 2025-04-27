/* global afterEach, afterAll */

import * as admin from 'firebase-admin';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import type {
  DocumentData,
  Firestore,
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
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

// Initialize Firestore
const db = getFirestore(app);

// Global test timeout
jest.setTimeout(30000);

// Mock Firestore response objects
const mockWriteResult: WriteResult = {
  writeTime: Timestamp.now(),
} as WriteResult;

const mockDocSnapshot: DocumentSnapshot = {
  exists: true,
  id: 'test-doc-id',
  data: jest.fn().mockReturnValue({ id: 'test-doc-id' }),
  ref: {} as DocumentReference,
} as unknown as DocumentSnapshot;

const mockQuerySnapshot: QuerySnapshot<DocumentData> = {
  docs: [mockDocSnapshot],
  empty: false,
  size: 1,
  forEach: jest.fn(),
} as unknown as QuerySnapshot<DocumentData>;

// Create mock document and collection references
const mockGet = jest.fn().mockImplementation(() => Promise.resolve(mockDocSnapshot));
const mockSet = jest
  .fn()
  .mockImplementation((_data: DocumentData) => Promise.resolve(mockWriteResult));
const mockUpdate = jest
  .fn()
  .mockImplementation((_data: Partial<DocumentData>) => Promise.resolve(mockWriteResult));
const mockDelete = jest.fn().mockImplementation(() => Promise.resolve(mockWriteResult));
const mockCollection = jest.fn();

const mockDocRef: DocumentReference<DocumentData> = {
  collection: mockCollection,
  get: mockGet,
  set: mockSet as unknown as jest.Mock,
  update: mockUpdate,
  delete: mockDelete,
} as unknown as DocumentReference<DocumentData>;

const mockCollRef: CollectionReference<DocumentData> = {
  doc: jest.fn().mockReturnValue(mockDocRef),
  get: jest.fn().mockImplementation(() => Promise.resolve(mockQuerySnapshot)),
  where: jest.fn(() => mockCollRef),
  orderBy: jest.fn(() => mockCollRef),
  limit: jest.fn(() => mockCollRef),
} as unknown as CollectionReference<DocumentData>;

// Mock Firestore with proper types
const mockFirestore: Firestore = {
  collection: jest.fn().mockReturnValue(mockCollRef),
  doc: jest.fn().mockReturnValue(mockDocRef),
} as unknown as Firestore;

// Set up default mock implementations
mockGet.mockResolvedValue(mockDocSnapshot);
mockSet.mockResolvedValue(mockWriteResult);
mockUpdate.mockResolvedValue(mockWriteResult);
mockDelete.mockResolvedValue(mockWriteResult);

// Mock the admin.firestore() call
jest.spyOn(admin, 'firestore').mockImplementation(() => mockFirestore);

// Clean up after each test
afterEach(async () => {
  // Clean up Firestore collections
  const collections = ['users', 'sources', 'shelves', 'items', 'integrations'];
  for (const collection of collections) {
    const snapshot = await db.collection(collection).get();
    const batch = db.batch();
    snapshot.docs.forEach(_doc => {
      batch.delete(_doc.ref);
    });
    await batch.commit();
  }
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(async () => {
  await app.delete();
});

export {
  db,
  mockDocRef,
  mockCollRef,
  mockFirestore,
  mockDocSnapshot,
  mockQuerySnapshot,
  mockWriteResult,
};
