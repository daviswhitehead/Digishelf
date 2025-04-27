import axios, { AxiosError } from 'axios';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export const SHELF_IDS = {
  // Main shelves
  CURRENTLY_READING: 'currently-reading',
  READ: 'read',
  // Test shelf
  TEST: 'digishelf-test',
} as const;

type ShelfId = (typeof SHELF_IDS)[keyof typeof SHELF_IDS];

interface FixtureMetadata {
  generated: string;
  source: string;
  purpose: string;
  shelfId: ShelfId;
  page?: number;
}

/**
 * Sanitizes HTML response to remove sensitive data
 */
function sanitizeResponse(html: string): string {
  return (
    html
      // Remove user IDs
      .replace(/user-\d+/g, 'user-xxx')
      // Remove emails
      .replace(/email=([^&"]+)/g, 'email=xxx@xxx.com')
      // Remove authentication tokens
      .replace(/auth_token=([^&"]+)/g, 'auth_token=xxx')
      // Remove any script tags and their contents
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove Google Analytics
      .replace(/ga\('.*?'\);/g, '')
      // Remove user profile links
      .replace(/href="\/user\/show\/\d+/g, 'href="/user/show/xxx')
      // Remove timestamps
      .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, '2024-01-01T00:00:00')
  );
}

/**
 * Adds metadata as HTML comments to the fixture
 */
function addMetadata(html: string, metadata: FixtureMetadata): string {
  const comment = `<!--
  Generated: ${metadata.generated}
  Source: ${metadata.source}
  Purpose: ${metadata.purpose}
  Shelf ID: ${metadata.shelfId}${metadata.page ? `\n  Page: ${metadata.page}` : ''}
-->`;
  return `${comment}\n${html}`;
}

/**
 * Fetches a shelf page from Goodreads
 */
async function fetchShelfPage(shelfId: ShelfId, page: number = 1): Promise<string> {
  const url = `https://www.goodreads.com/review/list/61851004-davis-whitehead?shelf=${shelfId}${page > 1 ? `&page=${page}` : ''}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TestFixtureBot/1.0)',
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Capture the error response for error case fixtures
      return error.response?.data || `<html><body><h1>Error: ${error.message}</h1></body></html>`;
    }
    throw error;
  }
}

/**
 * Saves a fixture to disk with metadata and sanitization
 */
async function saveFixture(
  content: string,
  filename: string,
  metadata: FixtureMetadata,
  fixturesDir: string
): Promise<void> {
  const sanitized = sanitizeResponse(content);
  const withMetadata = addMetadata(sanitized, metadata);
  writeFileSync(join(fixturesDir, filename), withMetadata);
  console.log(`✓ Generated ${filename}`);
}

/**
 * Generates all fixtures for testing
 */
async function generateFixtures() {
  const fixturesDir = join(__dirname, '../sources/goodreads/__tests__/__fixtures__/responses');

  // Ensure directories exist
  mkdirSync(fixturesDir, { recursive: true });

  const now = new Date().toISOString();

  try {
    // Success cases
    const fixtures = [
      {
        name: 'currently_reading.html',
        shelfId: SHELF_IDS.CURRENTLY_READING,
        purpose: 'Test case for currently reading shelf',
      },
      {
        name: 'read_shelf.html',
        shelfId: SHELF_IDS.READ,
        purpose: 'Test case for read shelf',
      },
      {
        name: 'read_shelf_page_2.html',
        shelfId: SHELF_IDS.READ,
        page: 2,
        purpose: 'Test case for subsequent pages of read shelf',
      },
      {
        name: 'test_shelf.html',
        shelfId: SHELF_IDS.TEST,
        purpose: 'Test case for test shelf',
      },
    ];

    // Generate success case fixtures
    for (const fixture of fixtures) {
      const response = await fetchShelfPage(fixture.shelfId, fixture.page);
      await saveFixture(
        response,
        fixture.name,
        {
          generated: now,
          source: 'Goodreads API',
          purpose: fixture.purpose,
          shelfId: fixture.shelfId,
          page: fixture.page,
        },
        fixturesDir
      );
    }

    // Generate error case fixtures
    const errorCases = [
      {
        name: 'invalid_shelf.html',
        shelfId: 'invalid-shelf' as ShelfId,
        purpose: 'Test case for invalid shelf ID',
      },
      {
        name: 'invalid_page.html',
        shelfId: SHELF_IDS.READ,
        page: 999,
        purpose: 'Test case for invalid page number',
      },
    ];

    for (const errorCase of errorCases) {
      const response = await fetchShelfPage(errorCase.shelfId, errorCase.page);
      await saveFixture(
        response,
        errorCase.name,
        {
          generated: now,
          source: 'Goodreads API',
          purpose: errorCase.purpose,
          shelfId: errorCase.shelfId,
          page: errorCase.page,
        },
        fixturesDir
      );
    }

    console.log('\nFixture generation completed successfully! 🎉');
  } catch (error) {
    console.error('\nError generating fixtures:', error);
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  generateFixtures();
}

export { generateFixtures, sanitizeResponse, addMetadata };
