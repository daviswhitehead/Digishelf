import { Timestamp } from 'firebase/firestore';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  primaryColor?: string;
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
}

export interface ShelfDetails {
  displayName: string;
  sourceDisplayName: string;
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface BookGridProps {
  columns: Book[][];
  cardWidth: number;
  margin: number;
}

export interface ShelfProps {
  shelfId?: string;
}
