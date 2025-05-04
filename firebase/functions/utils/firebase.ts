import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function initializeFirebase() {
  const app = !getApps().length ? initializeApp() : getApp();
  const db = getFirestore(app);
  return { app, db };
}

export const { app, db } = initializeFirebase();
