"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateRating = translateRating;
exports.cleanNewLines = cleanNewLines;
exports.getTotalPages = getTotalPages;
const constants_1 = require("./constants");
/**
 * Translates a textual rating into a numerical star rating.
 */
function translateRating(ratingText) {
    return ratingText ? constants_1.RATING_MAP[ratingText.toLowerCase()] : null;
}
/**
 * Removes newlines and extra spaces from a string
 */
function cleanNewLines(s) {
    return s.replace(/\n\s+/g, ' ');
}
/**
 * Extracts the total number of pages from pagination
 */
function getTotalPages($) {
    // First check for numeric page links
    const pageLinks = $('#reviewPagination a')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => /^\d+$/.test(text))
        .map(Number);
    if (pageLinks.length > 0) {
        return Math.max(...pageLinks);
    }
    // Check for next button
    const hasNextButton = $('a[rel="next"]').length > 0;
    if (hasNextButton) {
        return 2;
    }
    // Check for content
    const hasContent = $('.review').length > 0;
    return hasContent ? 1 : 0;
}
//# sourceMappingURL=utils.js.map