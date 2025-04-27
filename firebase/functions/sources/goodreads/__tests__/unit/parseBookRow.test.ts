import { readFileSync } from 'fs';
import { join } from 'path';
import * as cheerio from 'cheerio';
import { parseBookRow } from '../../data';

function getElement(html: string) {
  const $ = cheerio.load(html);
  const elem = $('tr.review').first().get(0);
  if (!elem) {
    throw new Error('No review element found');
  }
  return { $, elem };
}

function getBookRowFromFixture() {
  const html = readFileSync(
    join(__dirname, '..', '__fixtures__/responses/currently_reading.html'),
    'utf8'
  );
  return getElement(html);
}

describe('parseBookRow', () => {
  it('parses a complete book row', () => {
    const { $, elem } = getBookRowFromFixture();
    const result = parseBookRow($, elem);

    expect(result).toEqual({
      title: 'Wind and Truth (The Stormlight Archive, #5)',
      author: 'Sanderson, Brandon',
      canonicalURL: 'https://www.goodreads.com/book/show/203578847-wind-and-truth',
      coverImage:
        'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1724944713l/203578847.jpg',
      primaryColor: '',
      userRating: null,
      userReview: 'review None',
    });
  });

  it('handles missing fields', () => {
    const html = `
      <table>
        <tr class="review">
          <td class="field title">
            <div class="value">
              <a href="/book/show/123">Test Book</a>
            </div>
          </td>
          <td class="field author">
            <div class="value">
              <a href="/author/show/123">Unknown Author</a>
            </div>
          </td>
        </tr>
      </table>
    `;
    const { $, elem } = getElement(html);
    const result = parseBookRow($, elem);

    expect(result).toEqual({
      title: 'Test Book',
      author: 'Unknown Author',
      canonicalURL: 'https://www.goodreads.com/book/show/123',
      coverImage: '',
      primaryColor: '',
      userRating: null,
      userReview: '',
    });
  });
});
