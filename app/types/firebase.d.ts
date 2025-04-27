import {
  Firestore,
  DocumentData,
  DocumentReference,
  CollectionReference,
  Query,
  Timestamp,
  QueryDocumentSnapshot,
  FieldValue,
} from 'firebase/firestore';
import { Functions, HttpsCallable, HttpsCallableResult } from 'firebase/functions';
import { FirebaseApp } from '@firebase/app';

declare module 'firebase/app' {
  export * from '@firebase/app';
  export { FirebaseApp };
  export function initializeApp(options: any, name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
}

declare module 'firebase/auth' {
  export * from '@firebase/auth';
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
  }
  export function getAuth(app?: FirebaseApp): any;
  export function onAuthStateChanged(auth: any, callback: (user: User | null) => void): () => void;
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore';

  export interface IntegrationData extends DocumentData {
    id: string;
    type: string;
    userId: string;
    displayName: string;
    accountSlug: string;
    myBooksURL: string;
    integrationId: string;
    createdAt: FieldValue | Timestamp;
    updatedAt: FieldValue | Timestamp;
  }

  export interface QueryConstraint {
    type: string;
  }

  export interface QueryCompositeFilterConstraint extends QueryConstraint {}
  export interface QueryNonFilterConstraint extends QueryConstraint {}

  export function getFirestore(app?: FirebaseApp): any;
  export function collection(firestore: any, path: string): CollectionReference<DocumentData>;
  export function doc(
    reference: CollectionReference<DocumentData>,
    id?: string
  ): DocumentReference<DocumentData>;
  export function query(
    query: Query<DocumentData>,
    ...queryConstraints: QueryConstraint[]
  ): Query<DocumentData>;
  export function where(field: string, opStr: string, value: any): QueryConstraint;
  export function getDoc<T = DocumentData>(
    reference: DocumentReference<T>
  ): Promise<QueryDocumentSnapshot<T>>;
  export function getDocs<T = DocumentData>(
    query: Query<T>
  ): Promise<{
    docs: QueryDocumentSnapshot<T>[];
    forEach(callback: (doc: QueryDocumentSnapshot<T>) => void): void;
  }>;
  export function setDoc<T = DocumentData>(
    reference: DocumentReference<T>,
    data: Partial<T>
  ): Promise<void>;
  export function serverTimestamp(): FieldValue;
}

declare module 'firebase/storage' {
  export * from '@firebase/storage';
  export function getStorage(app?: FirebaseApp): any;
}

declare module 'firebase/functions' {
  export * from '@firebase/functions';
  export function getFunctions(app?: FirebaseApp): Functions;
  export function httpsCallable<RequestData = unknown, ResponseData = unknown>(
    functions: Functions,
    name: string
  ): HttpsCallable<RequestData, ResponseData>;
  export function connectFunctionsEmulator(functions: Functions, host: string, port: number): void;
}

export interface FirebaseFunctionResponse<T = unknown> extends HttpsCallableResult {
  data: T;
}

export interface FirebaseError extends Error {
  code: string;
  message: string;
  details?: unknown;
}
