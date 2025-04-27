import {
  Firestore,
  DocumentData,
  DocumentReference,
  CollectionReference,
} from 'firebase/firestore';
import { Functions, HttpsCallable, HttpsCallableResult } from 'firebase/functions';
import { FirebaseApp } from 'firebase/app';

declare module 'firebase/firestore' {
  interface IntegrationData extends DocumentData {
    id: string;
    displayName: string;
  }

  // Extend the doc function types
  export function doc<T = DocumentData>(
    firestore: Firestore,
    path: string,
    ...pathSegments: string[]
  ): DocumentReference<T>;

  export function collection<T = DocumentData>(
    firestore: Firestore,
    path: string,
    ...pathSegments: string[]
  ): CollectionReference<T>;

  export function getDoc<T = DocumentData>(reference: DocumentReference<T>): Promise<DocumentData>;

  export function setDoc<T = DocumentData>(reference: DocumentReference<T>, data: T): Promise<void>;
}

declare module 'firebase/functions' {
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
