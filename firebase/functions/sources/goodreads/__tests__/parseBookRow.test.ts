import * as cheerio from 'cheerio';
import { parseBookRow } from '../data';

describe('parseBookRow', () => {
  it('should parse a complete book row', () => {
    const html = `
      <tr class="review">
        <td class="field cover">
          <img src="https://images.gr-assets.com/books/123.jpg" />
        </td>
        <td class="field title">
          <a href="/book/show/123">Test Book</a>
        </td>
        <td class="field author">
          <a href="/author/show/456">Test Author</a>
        </td>
        <td class="field isbn">1234567890</td>
        <td class="field avg_rating">4.5</td>
        <td class="field date_added">2024-03-20</td>
        <td class="field rating">
          <span class="staticStars" title="4.0 stars">★★★★☆</span>
        </td>
        <td class="field review">
          <span id="freeTextreview123">Great book!</span>
        </td>
      </tr>
    `;
    const $ = cheerio.load(html);
    const $row = $('tr.review');
    const result = parseBookRow($, $row);

    expect(result).toEqual({
      title: 'Test Book',
      author: 'Test Author',
      coverImg: 'https://images.gr-assets.com/books/123.jpg',
      isbn: '1234567890',
      avgRating: 4.5,
      dateAdded: '2024-03-20',
      review: 'Great book!',
      userRating: 4.0,
    });
  });

  it('should handle missing fields', () => {
    const html = `
      <tr class="review">
        <td class="field cover"></td>
        <td class="field title">
          <a href="/book/show/123">Test Book</a>
        </td>
        <td class="field author">
          <a href="/author/show/456">Test Author</a>
        </td>
        <td class="field isbn"></td>
        <td class="field avg_rating"></td>
        <td class="field date_added"></td>
        <td class="field rating"></td>
        <td class="field review"></td>
      </tr>
    `;
    const $ = cheerio.load(html);
    const $row = $('tr.review');
    const result = parseBookRow($, $row);

    expect(result).toEqual({
      title: 'Test Book',
      author: 'Test Author',
      coverImg: '',
      isbn: '',
      avgRating: 0,
      dateAdded: '',
      review: '',
      userRating: 0,
    });
  });
});
