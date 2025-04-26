import * as cheerio from 'cheerio';
import { getTotalPages } from '../utils';

describe('getTotalPages', () => {
  it('should return total pages when pagination exists', () => {
    const html = `
      <div id="reviewPagination">
        <a href="?page=1">1</a>
        <a href="?page=2">2</a>
        <a href="?page=3">3</a>
      </div>
    `;
    const $ = cheerio.load(html);
    expect(getTotalPages($)).toBe(3);
  });

  it('should return 0 when no pagination exists', () => {
    const html = `
      <div>
        <p>No pagination here</p>
      </div>
    `;
    const $ = cheerio.load(html);
    expect(getTotalPages($)).toBe(0);
  });

  it('should return 2 when next button exists', () => {
    const html = `
      <div id="reviewPagination">
        <a href="?page=1">1</a>
        <a href="?page=2" rel="next">next</a>
      </div>
    `;
    const $ = cheerio.load(html);
    expect(getTotalPages($)).toBe(2);
  });
});
