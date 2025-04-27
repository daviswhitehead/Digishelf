import { jest } from '@jest/globals';
import * as admin from 'firebase-admin';
import type {
  Firestore,
  DocumentData,
  DocumentReference,
  CollectionReference,
  DocumentSnapshot,
  WriteResult,
} from 'firebase-admin/firestore';

export function createMockFirestore(mockData: DocumentData = {}) {
  const mockDoc = {
    exists: true,
    data: () => mockData,
    id: 'test-id',
    ref: {} as DocumentReference,
  } as unknown as DocumentSnapshot;

  const docRef = {
    get: jest.fn<() => Promise<DocumentSnapshot>>().mockResolvedValue(mockDoc),
    set: jest.fn<() => Promise<WriteResult>>().mockResolvedValue({} as WriteResult),
    update: jest.fn<() => Promise<WriteResult>>().mockResolvedValue({} as WriteResult),
    delete: jest.fn<() => Promise<WriteResult>>().mockResolvedValue({} as WriteResult),
  } as unknown as DocumentReference;

  const mockCollection = {
    doc: jest.fn<() => DocumentReference>().mockReturnValue(docRef),
  } as unknown as CollectionReference;

  const mockFirestore = {
    collection: jest.fn<() => CollectionReference>().mockReturnValue(mockCollection),
    doc: jest.fn(),
    getAll: jest.fn(),
    runTransaction: jest.fn(),
    batch: jest.fn(),
  } as unknown as Firestore;

  jest.spyOn(admin, 'firestore').mockImplementation(() => mockFirestore);

  return {
    mockFirestore,
    mockCollection,
    mockDoc,
    docRef,
  };
}
