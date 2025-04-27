'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
const cheerio = __importStar(require('cheerio'));
const data_1 = require('../data');
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
    const elem = $('.field.review')[0];
    expect((0, data_1.extractReviewText)($, elem)).toBe('This is a review');
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
    const elem = $('.field.review')[0];
    expect((0, data_1.extractReviewText)($, elem)).toBe('Another review');
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
    const elem = $('.field.review')[0];
    expect((0, data_1.extractReviewText)($, elem)).toBe('Review with spaces');
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
    const elem = $('.field.review')[0];
    expect((0, data_1.extractReviewText)($, elem)).toBe('');
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
    const elem = $('.field.review')[0];
    expect((0, data_1.extractReviewText)($, elem)).toBe('Nested review text');
  });
});
//# sourceMappingURL=extractReviewText.test.js.map
