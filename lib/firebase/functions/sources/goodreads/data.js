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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractReviewText = extractReviewText;
exports.parseBookRow = parseBookRow;
exports.getPageItems = getPageItems;
exports.getAllPages = getAllPages;
const axios_1 = __importStar(require("axios"));
const cheerio = __importStar(require("cheerio"));
const timing_1 = require("../../shared/utils/timing");
const retry_1 = require("../../shared/utils/retry");
const utils_1 = require("./utils");
const p_limit_1 = __importDefault(require("p-limit"));
const constants_1 = require("./constants");
/**
 * Extracts review text from a Goodreads review element using multiple possible selectors
 */
function extractReviewText($, elem) {
    // Try to find the review text in various possible locations
    const reviewSelectors = ['span[id^="freeTextreview"]', 'span[id^="freeText"]', '.field.review'];
    for (const selector of reviewSelectors) {
        const reviewText = $(elem).find(selector).text().trim();
        if (reviewText) {
            // Normalize whitespace: replace multiple spaces/newlines with a single space
            return reviewText.replace(/\s+/g, ' ').trim();
        }
    }
    // If no review text is found in any of the expected locations, return empty string
    return '';
}
/**
 * Parses a single book row from Goodreads HTML
 */
function parseBookRow($, elem) {
    // Cover Image
    let coverImage = $(elem).find('td.field.cover img').attr('src') || '';
    if (coverImage) {
        coverImage = coverImage.replace(/\._S[XY]\d+_/, '');
    }
    // Title and URL
    const titleLink = $(elem).find('td.field.title a');
    const title = (0, utils_1.cleanNewLines)(titleLink.text().trim());
    let canonicalURL = titleLink.attr('href') || '';
    if (canonicalURL && !canonicalURL.startsWith('http')) {
        canonicalURL = 'https://www.goodreads.com' + canonicalURL;
    }
    // Author
    const author = $(elem).find('td.field.author a').first().text().trim();
    // Rating and Review
    const rating = (0, utils_1.translateRating)($(elem).find('td.field.rating span.staticStars').attr('title'));
    const userReview = extractReviewText($, elem);
    return {
        title,
        author,
        coverImage,
        canonicalURL,
        userRating: rating,
        userReview,
        primaryColor: '',
    };
}
/**
 * Scrapes a single Goodreads shelf page with retry logic
 */
async function getPageItems(baseURL, pageNumber) {
    return (0, timing_1.withTiming)(`getPageItems-page-${pageNumber}`, async () => {
        var _a;
        try {
            const pageURL = baseURL + `&page=${pageNumber}`;
            // Fetch HTML with retry logic
            const { data: html } = await (0, retry_1.retry)(() => axios_1.default.get(pageURL), {
                retries: 3,
                minTimeout: 1000,
                factor: 2,
                onRetry: (error) => {
                    console.warn(`Retrying page ${pageNumber} after error:`, error instanceof axios_1.AxiosError ? error.message : 'Unknown error');
                },
            });
            // Load HTML with cheerio
            const $ = cheerio.load(html);
            const bookRows = $('tr.bookalike.review').toArray();
            if (!bookRows.length) {
                console.warn(`No books found on page ${pageNumber}`);
            }
            const limit = (0, p_limit_1.default)(constants_1.CONCURRENCY.PAGE_REQUESTS);
            const books = await Promise.all(bookRows.map(elem => limit(async () => parseBookRow($, elem))));
            return { books, $ };
        }
        catch (error) {
            const errorMessage = error instanceof axios_1.AxiosError
                ? `HTTP ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status}: ${error.message}`
                : error instanceof Error
                    ? error.message
                    : 'Unknown error';
            console.error(`Failed to fetch page ${pageNumber}:`, errorMessage);
            throw error;
        }
    });
}
/**
 * Gets all pages of a Goodreads shelf with parallel processing and error handling
 */
async function getAllPages(originalURL) {
    return (0, timing_1.withTiming)('getAllPages', async () => {
        try {
            // Fetch first page to get total pages
            const { books: booksOnPage1, $ } = await getPageItems(originalURL, 1);
            console.info(`Found ${booksOnPage1.length} books on page 1`);
            const totalPages = (0, utils_1.getTotalPages)($);
            console.info(`Total pages to process: ${totalPages}`);
            let allBooks = [...booksOnPage1];
            if (totalPages > 1) {
                const limit = (0, p_limit_1.default)(constants_1.CONCURRENCY.PAGE_REQUESTS);
                const pagePromises = Array.from({ length: totalPages - 1 }, (_, i) => limit(() => getPageItems(originalURL, i + 2)));
                const results = await Promise.allSettled(pagePromises);
                let successCount = 1; // Count first page as success
                let failureCount = 0;
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        const { books } = result.value;
                        console.info(`Found ${books.length} books on page ${index + 2}`);
                        allBooks = allBooks.concat(books);
                        successCount++;
                    }
                    else {
                        console.error(`Failed to fetch page ${index + 2} (${originalURL}&page=${index + 2}):`, result.reason instanceof Error ? result.reason.message : 'Unknown error');
                        failureCount++;
                    }
                });
                console.info(`Completed processing ${successCount}/${totalPages} pages successfully`);
                if (failureCount > 0) {
                    console.warn(`Failed to process ${failureCount} pages`);
                }
            }
            if (!allBooks.length) {
                console.warn('No books found in shelf');
                return null;
            }
            console.info(`Total books collected: ${allBooks.length}`);
            return allBooks;
        }
        catch (error) {
            console.error('Fatal error in getAllPages:', error instanceof Error ? error.message : 'Unknown error');
            return null;
        }
    }); // Type assertion to fix return type
}
//# sourceMappingURL=data.js.map