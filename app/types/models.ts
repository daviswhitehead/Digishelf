import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
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
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: Error | null;
}
