import * as cheerio from 'cheerio';
import { extractReviewText } from '../../data.js';

describe('extractReviewText', () => {
  it('extracts review text from freeTextreview span', () => {
    const html = `
      <div>
        <span id="freeTextreview123">This is a review</span>
      </div>
    `;
    const $ = cheerio.load(html) as cheerio.CheerioAPI;
    const elem = $('div').get(0);
    if (!elem) throw new Error('No element found');

    expect(extractReviewText($, elem)).toBe('This is a review');
  });

  it('extracts review text from freeText span', () => {
    const html = `
      <div>
        <span id="freeText456">Another review</span>
      </div>
    `;
    const $ = cheerio.load(html) as cheerio.CheerioAPI;
    const elem = $('div').get(0);
    if (!elem) throw new Error('No element found');

    expect(extractReviewText($, elem)).toBe('Another review');
  });

  it('normalizes whitespace in review text', () => {
    const html = `
      <div>
        <span id="freeTextreview789">
          Review
          with
          spaces
        </span>
      </div>
    `;
    const $ = cheerio.load(html) as cheerio.CheerioAPI;
    const elem = $('div').get(0);
    if (!elem) throw new Error('No element found');

    expect(extractReviewText($, elem)).toBe('Review with spaces');
  });

  it('returns empty string when no review text is found', () => {
    const html = `
      <div>
        <span>No review here</span>
      </div>
    `;
    const $ = cheerio.load(html) as cheerio.CheerioAPI;
    const elem = $('div').get(0);
    if (!elem) throw new Error('No element found');

    expect(extractReviewText($, elem)).toBe('');
  });

  it('extracts review text from field.review class', () => {
    const html = `
      <div>
        <div class="field review">
          <div>
            <span>Nested review text</span>
          </div>
        </div>
      </div>
    `;
    const $ = cheerio.load(html) as cheerio.CheerioAPI;
    const elem = $('div').get(0);
    if (!elem) throw new Error('No element found');

    expect(extractReviewText($, elem)).toBe('Nested review text');
  });
});
