import * as cheerio from 'cheerio';
import { extractReviewText } from '../data';

describe('extractReviewText', () => {
  it('should extract review text from freeTextreview span', () => {
    const html = `
      <tr class="review">
        <td class="field review">
          <span id="freeTextreview123">This is a review</span>
        </td>
      </tr>
    `;
    const $ = cheerio.load(html);
    const $elem = $('tr.review');
    expect(extractReviewText($elem)).toBe('This is a review');
  });

  it('should extract review text from freeText span', () => {
    const html = `
      <tr class="review">
        <td class="field review">
          <span id="freeText456">Another review</span>
        </td>
      </tr>
    `;
    const $ = cheerio.load(html);
    const $elem = $('tr.review');
    expect(extractReviewText($elem)).toBe('Another review');
  });

  it('should normalize whitespace in review text', () => {
    const html = `
      <tr class="review">
        <td class="field review">
          <span id="freeTextreview789">Review  with   spaces</span>
        </td>
      </tr>
    `;
    const $ = cheerio.load(html);
    const $elem = $('tr.review');
    expect(extractReviewText($elem)).toBe('Review with spaces');
  });

  it('should return empty string when no review text is found', () => {
    const html = `
      <tr class="review">
        <td class="field review">
          <span id="other123"></span>
        </td>
      </tr>
    `;
    const $ = cheerio.load(html);
    const $elem = $('tr.review');
    expect(extractReviewText($elem)).toBe('');
  });

  it('should extract review text from nested elements', () => {
    const html = `
      <tr class="review">
        <td class="field review">
          <div>
            <span id="freeTextreview101">Nested review text</span>
          </div>
        </td>
      </tr>
    `;
    const $ = cheerio.load(html);
    const $elem = $('tr.review');
    expect(extractReviewText($elem)).toBe('Nested review text');
  });
});
