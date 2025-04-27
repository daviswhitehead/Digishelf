// / <reference types="jest" />

import * as admin from 'firebase-admin';
import type { DocumentReference, Timestamp } from 'firebase-admin/firestore';

declare global {
  // This namespace declaration is necessary for extending Jest's matchers
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeFirestoreTimestamp(): R;
      toMatchTimestamp(expected: Date | Timestamp): R;
      toBeDocumentReference(): R;
      toHaveDocumentPath(path: string): R;
    }
  }
}

expect.extend({
  toBeFirestoreTimestamp(received: unknown) {
    const pass = received instanceof admin.firestore.Timestamp;
    return {
      pass,
      message: () =>
        `expected ${received} to${pass ? ' not' : ''} be a Firestore Timestamp`,
    };
  },

  toMatchTimestamp(received: Timestamp, expected: Date | Timestamp) {
    const expectedDate = expected instanceof Date ? expected : expected.toDate();
    const receivedDate = received.toDate();
    const pass = receivedDate.getTime() === expectedDate.getTime();
    
    return {
      pass,
      message: () =>
        `expected ${receivedDate} to${pass ? ' not' : ''} match ${expectedDate}`,
    };
  },

  toBeDocumentReference(received: unknown) {
    const pass = received instanceof admin.firestore.DocumentReference;
    return {
      pass,
      message: () =>
        `expected ${received} to${pass ? ' not' : ''} be a Firestore DocumentReference`,
    };
  },

  toHaveDocumentPath(received: DocumentReference, path: string) {
    const pass = received.path === path;
    return {
      pass,
      message: () =>
        `expected document reference to${pass ? ' not' : ''} have path ${path}`,
    };
  },
}); 