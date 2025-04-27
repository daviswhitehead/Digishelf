import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Loads a fixture file from the __fixtures__ directory
 */
export function loadFixture(relativePath: string): string {
  const fixturesDir = join(__dirname);
  const fullPath = join(fixturesDir, relativePath);
  return readFileSync(fullPath, 'utf8');
}

/**
 * Known fixture paths
 */
export const FIXTURES = {
  SINGLE_PAGE: 'responses/single_page.html',
  MULTI_PAGE: 'responses/multi_page.html',
  EMPTY_SHELF: 'responses/empty_shelf.html',
  SUBSEQUENT_PAGE: 'responses/subsequent_page.html',
} as const; 