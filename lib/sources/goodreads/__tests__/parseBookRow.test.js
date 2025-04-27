"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const cheerio = __importStar(require("cheerio"));
const data_1 = require("../data");
function getElement(html) {
    const $ = cheerio.load(html);
    const elem = $('tr.review').first().get(0);
    if (!elem) {
        throw new Error('No review element found');
    }
    return { $, elem };
}
function getBookRowFromFixture() {
    const html = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '__fixtures__/responses/currently_reading.html'), 'utf8');
    return getElement(html);
}
describe('parseBookRow', () => {
    it('parses a complete book row', () => {
        const { $, elem } = getBookRowFromFixture();
        const result = (0, data_1.parseBookRow)($, elem);
        expect(result).toEqual({
            title: 'Wind and Truth (The Stormlight Archive, #5)',
            author: 'Sanderson, Brandon',
            canonicalURL: 'https://www.goodreads.com/book/show/203578847-wind-and-truth',
            coverImage: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1724944713l/203578847.jpg',
            primaryColor: '',
            userRating: null,
            userReview: 'review None'
        });
    });
    it('handles missing fields', () => {
        const html = `
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
    `;
        const { $, elem } = getElement(html);
        const result = (0, data_1.parseBookRow)($, elem);
        expect(result).toEqual({
            title: 'Test Book',
            author: 'Unknown Author',
            canonicalURL: 'https://www.goodreads.com/book/show/123',
            coverImage: '',
            primaryColor: '',
            userRating: null,
            userReview: ''
        });
    });
});
//# sourceMappingURL=parseBookRow.test.js.map