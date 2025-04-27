"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.functions = exports.googleProvider = exports.auth = exports.db = exports.app = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const functions_1 = require("firebase/functions");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.app = app;
// Initialize Firestore
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
// Initialize Firebase Authentication
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
// Initialize Google Auth Provider
const googleProvider = new auth_1.GoogleAuthProvider();
exports.googleProvider = googleProvider;
// Initialize Firebase Functions
const functions = (0, functions_1.getFunctions)(app);
exports.functions = functions;
// If using emulators locally, connect to the emulator
if (process.env.NODE_ENV === 'development') {
    (0, functions_1.connectFunctionsEmulator)(functions, 'localhost', 5001);
}
//# sourceMappingURL=firebase.js.map