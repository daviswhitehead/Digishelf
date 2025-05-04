import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  try {
    // Connect to Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('✅ Connected to Auth emulator');

    // Connect to Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('✅ Connected to Firestore emulator');

    // Connect to Functions emulator with updated port
    connectFunctionsEmulator(functions, 'localhost', 5002); // Updated port
    console.log('✅ Connected to Functions emulator');

    // Connect to Storage emulator
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('✅ Connected to Storage emulator');
  } catch (error) {
    console.error('❌ Error connecting to emulators:', error);
    // Log specific error details to help with debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
  }
}

export { app, auth, db, functions, storage };
