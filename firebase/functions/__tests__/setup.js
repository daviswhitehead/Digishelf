const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Set emulator environment variables
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8081';
process.env.FIREBASE_FUNCTIONS_EMULATOR_HOST = 'localhost:5001';

// Initialize Firebase Admin
const app = initializeApp({
  projectId: 'digishelf-app',
});

// Initialize Firestore
const db = getFirestore(app);

// Global test timeout
jest.setTimeout(30000);

// Clean up after each test
afterEach(async () => {
  // Clean up Firestore collections
  const collections = ['users', 'sources', 'shelves', 'items', 'integrations'];
  for (const collection of collections) {
    const snapshot = await db.collection(collection).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}); 