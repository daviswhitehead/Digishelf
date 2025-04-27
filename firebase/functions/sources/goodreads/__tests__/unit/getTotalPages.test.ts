import * as cheerio from 'cheerio';
import { getTotalPages } from '../../utils.js';

describe('getTotalPages', () => {
  it('returns the highest numeric page when multiple page links exist', () => {
    const html = `
      <div id="reviewPagination">
        <a>1</a>
        <a>2</a>
        <a>3</a>
        <a rel="next">next</a>
      </div>
    `;
    const $ = cheerio.load(html);
    expect(getTotalPages($)).toBe(3);
  });

  it('returns 0 when no content exists', () => {
    const html = `
      <div id="reviewPagination"></div>
    `;
    const $ = cheerio.load(html);
    expect(getTotalPages($)).toBe(0);
  });

  it('handles non-numeric links correctly', () => {
    const html = `
      <div id="reviewPagination">
        <a>1</a>
        <a>2</a>
        <a>next</a>
        <a>last</a>
      </div>
    `;
    const $ = cheerio.load(html);
    expect(getTotalPages($)).toBe(2);
  });
});
