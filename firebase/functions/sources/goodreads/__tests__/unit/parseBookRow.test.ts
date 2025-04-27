import * as cheerio from 'cheerio';
import { parseBookRow } from '../../data.js';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('parseBookRow', () => {
  it('parses a book from currently reading shelf', () => {
    const html = readFileSync(
      join(__dirname, '..', '__fixtures__/responses/currently_reading.html'),
      'utf8'
    );
    const $ = cheerio.load(html) as cheerio.CheerioAPI;
    const elem = $('tr.bookalike.review').first().get(0);
    if (!elem) throw new Error('No book element found');

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

  it('parses a book from read shelf with rating and review', () => {
    const html = readFileSync(
      join(__dirname, '..', '__fixtures__/responses/read_shelf.html'),
      'utf8'
    );
    const $ = cheerio.load(html) as cheerio.CheerioAPI;
    const elem = $('tr.bookalike.review').first().get(0);
    if (!elem) throw new Error('No book element found');

    const result = parseBookRow($, elem);

    expect(result).toEqual({
      title: 'Sex at Dawn: The Prehistoric Origins of Modern Sexuality',
      author: 'Ryan, Christopher',
      canonicalURL: 'https://www.goodreads.com/book/show/7640261-sex-at-dawn',
      coverImage:
        'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1291105594l/7640261.jpg',
      primaryColor: '',
      userRating: 4,
      userReview:
        "Before reading, I didn't know anything about the evolution of human sexuality. Nor did I ever think to question monogamy as its default construct. This book makes a really compelling case that monogamy is a recent invention and multiple sexual partners is more natural and healthy. I'd recommend this to anyone interested in the topic and I'd encourage you to quickly skim through sections that you find boring. E.g. the first quarter of the book is spent repetitively bashing the monogamy narrative instead of presenting compelling evidence for the multiple sexual partners narrative.",
    });
  });

  it('handles empty test shelf', () => {
    const html = readFileSync(
      join(__dirname, '..', '__fixtures__/responses/test_shelf.html'),
      'utf8'
    );
    const $ = cheerio.load(html) as cheerio.CheerioAPI;
    const bookRows = $('tr.bookalike.review');

    expect(bookRows.length).toBe(0);
  });

  it('handles books from paginated shelves', () => {
    const html = readFileSync(
      join(__dirname, '..', '__fixtures__/responses/read_shelf_page_2.html'),
      'utf8'
    );
    const $ = cheerio.load(html) as cheerio.CheerioAPI;
    const elem = $('tr.bookalike.review').first().get(0);
    if (!elem) throw new Error('No book element found');

    const result = parseBookRow($, elem);

    // We're testing the structure here since the actual values might change
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('author');
    expect(result).toHaveProperty('canonicalURL');
    expect(result).toHaveProperty('coverImage');
    expect(result).toHaveProperty('primaryColor', '');
    expect([null, 1, 2, 3, 4, 5]).toContain(result.userRating);
    expect(typeof result.userReview).toBe('string');
  });
});
