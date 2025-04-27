import { Timestamp } from 'firebase/firestore';

export interface Integration {
  id?: string;
  userId: string;
  type: 'goodreads' | 'boardgamegeek'; // add more integration types as needed
  myBooksURL: string;
  displayName: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IntegrationProps {
  integrationId?: string;
}

export interface Source {
  id: string;
  displayName: string;
  shelves?: string[];
}
