import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import type { Firestore } from 'firebase-admin/firestore';

/**
 * Creates a mock Firestore instance
 * @returns Firestore instance configured for testing
 */
export function createMockFirestore(): Firestore {
  // Use the emulator if not already initialized
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8081';
  }

  // Initialize app if not already initialized
  let app: admin.app.App;
  try {
    app = admin.app();
  } catch {
    app = admin.initializeApp({
      projectId: 'digishelf-app-test',
    });
  }

  return getFirestore(app);
}

/**
 * Creates test timestamp
 * @param date Optional date to use
 * @returns Firestore Timestamp
 */
export function createTimestamp(date: Date = new Date()): admin.firestore.Timestamp {
  return admin.firestore.Timestamp.fromDate(date);
}

/**
 * Creates a mock document reference
 * @param path Document path
 * @returns Firestore DocumentReference
 */
export function createDocRef(path: string): admin.firestore.DocumentReference {
  const db = createMockFirestore();
  return db.doc(path);
}

/**
 * Creates a mock collection reference
 * @param path Collection path
 * @returns Firestore CollectionReference
 */
export function createCollectionRef(path: string): admin.firestore.CollectionReference {
  const db = createMockFirestore();
  return db.collection(path);
}

/**
 * Helper to convert Firestore data to plain object
 * @param data Firestore DocumentData
 * @returns Plain JavaScript object
 */
export function convertToPlainObject(data: admin.firestore.DocumentData): object {
  return JSON.parse(JSON.stringify(data));
} 