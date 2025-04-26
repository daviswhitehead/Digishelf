import { GoodreadsBook } from '../types';

export interface MockResponseOptions {
  totalPages?: number;
}

class GoodreadsMocks {
  /**
   * Creates a mock Goodreads HTML response
   */
  static mockGoodreadsResponse(
    books: GoodreadsBook[],
    options: MockResponseOptions = {}
  ): string {
    const { totalPages = 1 } = options;
    
    const paginationLinks = Array.from(
      { length: totalPages },
      (_, i) => `<a href="#">${i + 1}</a>`
    ).join('');

    const rows = books.map(book => `
      <tr class="bookalike review">
        <td class="field cover">
          <img src="${book.coverImage}" />
        </td>
        <td class="field title">
          <a href="${book.canonicalURL}">${book.title}</a>
        </td>
        <td class="field author">
          <a href="#">${book.author}</a>
        </td>
        <td class="field rating">
          <span class="staticStars" title="${book.userRating ? 'really liked it' : ''}">${'★'.repeat(book.userRating || 0)}</span>
        </td>
        <td class="field review">
          <span id="freeTextreview123">${book.userReview || ''}</span>
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <body>
          <div id="reviewPagination">
            ${paginationLinks}
            ${totalPages > 1 ? '<a rel="next" href="#">next »</a>' : ''}
          </div>
          <table>
            ${rows}
          </table>
        </body>
      </html>
    `;
  }

  /**
   * Creates a mock book object
   */
  static createMockBook(overrides: Partial<GoodreadsBook> = {}): GoodreadsBook {
    return {
      title: 'Test Book',
      author: 'Test Author',
      coverImage: 'https://example.com/cover.jpg',
      canonicalURL: 'https://www.goodreads.com/book/show/123',
      userRating: 4,
      userReview: 'Great book!',
      primaryColor: '',
      ...overrides,
    };
  }
}

export const { mockGoodreadsResponse, createMockBook } = GoodreadsMocks; 