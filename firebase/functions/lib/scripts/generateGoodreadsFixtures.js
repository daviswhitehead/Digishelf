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
exports.SHELF_IDS = void 0;
exports.generateFixtures = generateFixtures;
exports.sanitizeResponse = sanitizeResponse;
exports.addMetadata = addMetadata;
const axios_1 = __importStar(require("axios"));
const fs_1 = require("fs");
const path_1 = require("path");
exports.SHELF_IDS = {
    // Main shelves
    CURRENTLY_READING: 'currently-reading',
    READ: 'read',
    // Test shelf
    TEST: 'digishelf-test',
};
/**
 * Sanitizes HTML response to remove sensitive data
 */
function sanitizeResponse(html) {
    return html
        // Remove user IDs
        .replace(/user-\d+/g, 'user-xxx')
        // Remove emails
        .replace(/email=([^&"]+)/g, 'email=xxx@xxx.com')
        // Remove authentication tokens
        .replace(/auth_token=([^&"]+)/g, 'auth_token=xxx')
        // Remove any script tags and their contents
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove Google Analytics
        .replace(/ga\('.*?'\);/g, '')
        // Remove user profile links
        .replace(/href="\/user\/show\/\d+/g, 'href="/user/show/xxx')
        // Remove timestamps
        .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, '2024-01-01T00:00:00');
}
/**
 * Adds metadata as HTML comments to the fixture
 */
function addMetadata(html, metadata) {
    const comment = `<!--
  Generated: ${metadata.generated}
  Source: ${metadata.source}
  Purpose: ${metadata.purpose}
  Shelf ID: ${metadata.shelfId}${metadata.page ? `\n  Page: ${metadata.page}` : ''}
-->`;
    return `${comment}\n${html}`;
}
/**
 * Fetches a shelf page from Goodreads
 */
async function fetchShelfPage(shelfId, page = 1) {
    var _a;
    const url = `https://www.goodreads.com/review/list/61851004-davis-whitehead?shelf=${shelfId}${page > 1 ? `&page=${page}` : ''}`;
    try {
        const response = await axios_1.default.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; TestFixtureBot/1.0)',
            },
            timeout: 10000,
        });
        return response.data;
    }
    catch (error) {
        if (error instanceof axios_1.AxiosError) {
            // Capture the error response for error case fixtures
            return ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || `<html><body><h1>Error: ${error.message}</h1></body></html>`;
        }
        throw error;
    }
}
/**
 * Saves a fixture to disk with metadata and sanitization
 */
async function saveFixture(content, filename, metadata, fixturesDir) {
    const sanitized = sanitizeResponse(content);
    const withMetadata = addMetadata(sanitized, metadata);
    (0, fs_1.writeFileSync)((0, path_1.join)(fixturesDir, filename), withMetadata);
    console.log(`✓ Generated ${filename}`);
}
/**
 * Generates all fixtures for testing
 */
async function generateFixtures() {
    const fixturesDir = (0, path_1.join)(__dirname, '../sources/goodreads/__tests__/__fixtures__/responses');
    // Ensure directories exist
    (0, fs_1.mkdirSync)(fixturesDir, { recursive: true });
    const now = new Date().toISOString();
    try {
        // Success cases
        const fixtures = [
            {
                name: 'currently_reading.html',
                shelfId: exports.SHELF_IDS.CURRENTLY_READING,
                purpose: 'Test case for currently reading shelf',
            },
            {
                name: 'read_shelf.html',
                shelfId: exports.SHELF_IDS.READ,
                purpose: 'Test case for read shelf',
            },
            {
                name: 'read_shelf_page_2.html',
                shelfId: exports.SHELF_IDS.READ,
                page: 2,
                purpose: 'Test case for subsequent pages of read shelf',
            },
            {
                name: 'test_shelf.html',
                shelfId: exports.SHELF_IDS.TEST,
                purpose: 'Test case for test shelf',
            },
        ];
        // Generate success case fixtures
        for (const fixture of fixtures) {
            const response = await fetchShelfPage(fixture.shelfId, fixture.page);
            await saveFixture(response, fixture.name, {
                generated: now,
                source: 'Goodreads API',
                purpose: fixture.purpose,
                shelfId: fixture.shelfId,
                page: fixture.page,
            }, fixturesDir);
        }
        // Generate error case fixtures
        const errorCases = [
            {
                name: 'invalid_shelf.html',
                shelfId: 'invalid-shelf',
                purpose: 'Test case for invalid shelf ID',
            },
            {
                name: 'invalid_page.html',
                shelfId: exports.SHELF_IDS.READ,
                page: 999,
                purpose: 'Test case for invalid page number',
            },
        ];
        for (const errorCase of errorCases) {
            const response = await fetchShelfPage(errorCase.shelfId, errorCase.page);
            await saveFixture(response, errorCase.name, {
                generated: now,
                source: 'Goodreads API',
                purpose: errorCase.purpose,
                shelfId: errorCase.shelfId,
                page: errorCase.page,
            }, fixturesDir);
        }
        console.log('\nFixture generation completed successfully! 🎉');
    }
    catch (error) {
        console.error('\nError generating fixtures:', error);
        process.exit(1);
    }
}
// Only run if called directly
if (require.main === module) {
    generateFixtures();
}
//# sourceMappingURL=generateGoodreadsFixtures.js.map