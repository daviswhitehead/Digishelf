import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { extractReviewText } from '../../data';

describe('extractReviewText', () => {
  it('extracts review text from freeTextreview span', () => {
    const html = `
<html>
<body>
  <table>
    <tr>
      <td class="field review">
        <span id="freeTextreview123">This is a review</span>
      </td>
    </tr>
  </table>
</body>
</html>`;
    const $ = cheerio.load(html);
    const elem = $('.field.review')[0] as Element;
    expect(extractReviewText($, elem)).toBe('This is a review');
  });

  it('extracts review text from freeText span', () => {
    const html = `
<html>
<body>
  <table>
    <tr>
      <td class="field review">
        <span id="freeText456">Another review</span>
      </td>
    </tr>
  </table>
</body>
</html>`;
    const $ = cheerio.load(html);
    const elem = $('.field.review')[0] as Element;
    expect(extractReviewText($, elem)).toBe('Another review');
  });

  it('trims whitespace from review text', () => {
    const html = `
<html>
<body>
  <table>
    <tr>
      <td class="field review">
        <span id="freeTextreview123">
          Review with spaces
        </span>
      </td>
    </tr>
  </table>
</body>
</html>`;
    const $ = cheerio.load(html);
    const elem = $('.field.review')[0] as Element;
    expect(extractReviewText($, elem)).toBe('Review with spaces');
  });

  it('returns empty string for no review text', () => {
    const html = `
<html>
<body>
  <table>
    <tr>
      <td class="field review"></td>
    </tr>
  </table>
</body>
</html>`;
    const $ = cheerio.load(html);
    const elem = $('.field.review')[0] as Element;
    expect(extractReviewText($, elem)).toBe('');
  });

  it('handles nested review text correctly', () => {
    const html = `
<html>
<body>
  <table>
    <tr>
      <td class="field review">
        <div class="outer">
          <span id="freeTextreview789">Nested review text</span>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
    const $ = cheerio.load(html);
    const elem = $('.field.review')[0] as Element;
    expect(extractReviewText($, elem)).toBe('Nested review text');
  });
});
