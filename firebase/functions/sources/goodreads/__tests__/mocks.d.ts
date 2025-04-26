import { GoodreadsBook } from '../types';

export interface MockResponseOptions {
  totalPages?: number;
}

export function createMockBook(overrides?: Partial<GoodreadsBook>): GoodreadsBook;
export function mockGoodreadsResponse(books: GoodreadsBook[], options?: MockResponseOptions): string; 