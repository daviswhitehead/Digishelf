import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration object from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if required environment variables are present
const hasRequiredConfig =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId;

// Initialize Firebase only if config is valid and not already initialized
let app = null;
let db = null;
let auth = null;
let googleProvider = null;

if (hasRequiredConfig) {
  try {
    // Initialize Firebase only if not already initialized
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    
    // Initialize Firestore
    db = getFirestore(app);
    
    // Initialize Firebase Authentication (only on client side)
    if (typeof window !== "undefined") {
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  // Log helpful error message
  const missingVars = [
    !firebaseConfig.apiKey && "NEXT_PUBLIC_FIREBASE_API_KEY",
    !firebaseConfig.authDomain && "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    !firebaseConfig.projectId && "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  ].filter(Boolean);

  const errorMessage = `Missing required Firebase environment variables: ${missingVars.join(", ")}. Please create a .env.local file in the app directory with your Firebase configuration.`;
  
  if (typeof window !== "undefined") {
    // Client-side: show error in console
    console.error(errorMessage);
  } else {
    // Server-side: log error but don't throw (prevents SSR crash)
    console.error(errorMessage);
  }
}

export { app, db, auth, googleProvider };
