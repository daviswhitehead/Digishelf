/* global jest, afterEach, afterAll */

import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import type { DocumentData } from 'firebase-admin/firestore';

// Import custom matchers
import './matchers/firestore';

// Mock environment variables
process.env = {
  ...process.env,
  FIRESTORE_EMULATOR_HOST: 'localhost:8081',
  FIREBASE_FUNCTIONS_EMULATOR_HOST: 'localhost:5001',
  FIREBASE_PROJECT_ID: 'demo-test',
  NODE_ENV: 'test',
};

// Initialize Firebase Admin with a mock app
const app = admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
});

// Initialize Firestore
export const db = getFirestore(app);

// Global test timeout
jest.setTimeout(30000);

// Mock Firestore
const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({ docs: [] }),
  set: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockResolvedValue(true),
  delete: jest.fn().mockResolvedValue(true),
};

// Mock the admin.firestore() call
jest.spyOn(admin, 'firestore').mockImplementation(() => mockFirestore as any);

// Clean up after each test
afterEach(async () => {
  // Clean up Firestore collections
  const collections = ['users', 'sources', 'shelves', 'items', 'integrations'];
  for (const collection of collections) {
    const snapshot = await db.collection(collection).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc: DocumentData) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(async () => {
  await app.delete();
});
