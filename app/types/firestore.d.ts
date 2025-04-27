import {
  DocumentData,
  DocumentReference,
  CollectionReference,
  Firestore,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

declare global {
  interface FirestoreDocument<T = DocumentData> extends QueryDocumentSnapshot<T> {
    id: string;
    ref: DocumentReference<T>;
    data(): T;
  }

  interface FirestoreCollection<T = DocumentData> {
    id: string;
    ref: CollectionReference<T>;
    data: T[];
  }

  // Add Firestore DB type
  interface FirestoreDB extends Firestore {}
}

export {};
