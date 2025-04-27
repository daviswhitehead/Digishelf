import { Timestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

export interface UserData {
  userId: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  primaryColor?: string;
  description?: string;
  isbn?: string;
  pageCount?: number;
  publishedDate?: string;
  publisher?: string;
}

export interface Shelf {
  id: string;
  userId: string;
  displayName: string;
  sourceDisplayName: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  sourceId: string;
  sourceType: string;
  books?: Book[];
}

export interface Source {
  id: string;
  displayName: string;
  description?: string;
  iconUrl?: string;
  url: string;
}

export interface Integration {
  id: string;
  userId: string;
  sourceId: string;
  accountId: string;
  accountSlug: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastSyncedAt?: Timestamp;
  status: 'active' | 'inactive' | 'error';
  error?: string;
}

export interface UseUserReturn {
  user: UserData | null;
  loading: boolean;
  error: FirebaseError | Error | null;
}

export type _User = {
  id: string;
  email: string;
  name: string;
  photoURL: string;
  createdAt: Date;
  updatedAt: Date;
};
