import { sanitizeResponse, addMetadata } from '../generateGoodreadsFixtures.js';

// Import the ShelfId type and SHELF_IDS constant
import { SHELF_IDS } from '../generateGoodreadsFixtures.js';
type ShelfId = (typeof SHELF_IDS)[keyof typeof SHELF_IDS];

describe('sanitizeResponse', () => {
  it('removes sensitive information from HTML', () => {
    const html = `
      <div>
        <a href="/user/show/61851004">Davis Whitehead</a>
        <span>user-67890</span>
        <form>
          <input type="hidden" name="email" value="test@example.com">
          <input type="hidden" name="auth_token" value="abc123xyz">
        </form>
        <script>
          ga('send', 'pageview');
          sensitive_data = 'should_be_removed';
        </script>
        <span>Created at 2024-03-15T14:30:45</span>
        <a href="https://www.goodreads.com/review/list/61851004-davis-whitehead?shelf=read">My Read Shelf</a>
      </div>
    `;

    const sanitized = sanitizeResponse(html);

    // Check that sensitive data is removed/replaced
    expect(sanitized).not.toContain('61851004');
    expect(sanitized).not.toContain('67890');
    expect(sanitized).not.toContain('test@example.com');
    expect(sanitized).not.toContain('abc123xyz');
    expect(sanitized).not.toContain('ga(');
    expect(sanitized).not.toContain('sensitive_data');
    expect(sanitized).not.toContain('2024-03-15T14:30:45');

    // Check that replacements are correct
    expect(sanitized).toContain('user-xxx');
    expect(sanitized).toContain('value="xxx@xxx.com"');
    expect(sanitized).toContain('value="xxx"');
    expect(sanitized).toContain('2024-01-01T00:00:00');
  });

  it('preserves important HTML structure', () => {
    const html = `
      <div class="bookalike review">
        <div class="field title">
          <a href="/book/show/123">Book Title</a>
        </div>
        <div class="field rating">
          <span class="staticStars">5 stars</span>
        </div>
        <div class="field review">
          <span id="freeTextreview123">Review text</span>
        </div>
      </div>
    `;

    const sanitized = sanitizeResponse(html);

    // Check that important structure is preserved
    expect(sanitized).toContain('<div class="bookalike review">');
    expect(sanitized).toContain('<div class="field title">');
    expect(sanitized).toContain('<div class="field rating">');
    expect(sanitized).toContain('<div class="field review">');
    expect(sanitized).toContain('Review text');
  });
});

describe('addMetadata', () => {
  it('adds metadata as HTML comments', () => {
    const html = '<div>Test content</div>';
    const metadata = {
      generated: '2024-03-15T12:00:00Z',
      source: 'Goodreads API',
      purpose: 'Test fixture',
      shelfId: SHELF_IDS.CURRENTLY_READING as ShelfId,
      page: 1,
    };

    const withMetadata = addMetadata(html, metadata);

    // Check that metadata is added as comments
    expect(withMetadata).toContain('<!--');
    expect(withMetadata).toContain('-->');
    expect(withMetadata).toContain('Generated: 2024-03-15T12:00:00Z');
    expect(withMetadata).toContain('Source: Goodreads API');
    expect(withMetadata).toContain('Purpose: Test fixture');
    expect(withMetadata).toContain('Shelf ID: currently-reading');
    expect(withMetadata).toContain('Page: 1');

    // Check that original content is preserved
    expect(withMetadata).toContain('<div>Test content</div>');
  });

  it('handles metadata without page number', () => {
    const html = '<div>Test content</div>';
    const metadata = {
      generated: '2024-03-15T12:00:00Z',
      source: 'Goodreads API',
      purpose: 'Test fixture',
      shelfId: SHELF_IDS.READ as ShelfId,
    };

    const withMetadata = addMetadata(html, metadata);

    // Check that metadata is added without page number
    expect(withMetadata).not.toContain('Page:');
    expect(withMetadata).toContain('Shelf ID: read');
  });
});
