import * as cheerio from 'cheerio';
import { getTotalPages } from '../../utils.js';

describe('getTotalPages', () => {
  it('returns the highest page number from pagination links', () => {
    const html = `
<html>
<body>
  <div id="reviewPagination">
    <a href="#">1</a>
    <a href="#">2</a>
    <a href="#">3</a>
  </div>
</body>
</html>`;
    const $ = cheerio.load(html);
    expect(getTotalPages($)).toBe(3);
  });

  it('returns 0 when no content is present', () => {
    const html = `
<html>
<body>
  <div id="reviewPagination"></div>
</body>
</html>`;
    const $ = cheerio.load(html);
    expect(getTotalPages($)).toBe(0);
  });

  it('returns 2 when next button is present', () => {
    const html = `
<html>
<body>
  <div id="reviewPagination">
    <a href="#">1</a>
    <a href="#" rel="next">Next</a>
  </div>
  <div class="review">Content</div>
</body>
</html>`;
    const $ = cheerio.load(html);
    expect(getTotalPages($)).toBe(2);
  });
});
