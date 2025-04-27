"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
const axios_1 = __importDefault(require("axios"));
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const loadFixture_1 = require("./__fixtures__/loadFixture");
describe('getAllPages', () => {
    let mock;
    beforeEach(() => {
        mock = new axios_mock_adapter_1.default(axios_1.default);
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
    });
    afterEach(() => {
        mock.reset();
        jest.clearAllMocks();
    });
    it('successfully fetches a single page shelf', async () => {
        const mockHTML = (0, loadFixture_1.loadFixture)('responses/currently_reading.html');
        const baseURL = 'https://www.goodreads.com/review/list/123';
        mock.onGet(`${baseURL}&page=1`).reply(200, mockHTML);
        const result = await (0, data_1.getAllPages)(baseURL);
        expect(result).toBeDefined();
        expect(result === null || result === void 0 ? void 0 : result.length).toBe(7); // Currently reading shelf has 7 books
        expect(result === null || result === void 0 ? void 0 : result[0]).toMatchObject({
            title: 'Wind and Truth (The Stormlight Archive, #5)',
            author: 'Sanderson, Brandon',
        });
    });
    it('handles empty shelf response', async () => {
        const mockHTML = (0, loadFixture_1.loadFixture)('responses/test_shelf.html');
        const baseURL = 'https://www.goodreads.com/review/list/123';
        mock.onGet(`${baseURL}&page=1`).reply(200, mockHTML);
        const result = await (0, data_1.getAllPages)(baseURL);
        expect(result).toBeDefined();
        expect(result).toEqual([]);
        expect(console.info).toHaveBeenCalledWith('Found 0 books on page 1');
    });
    it('handles network errors gracefully', async () => {
        const baseURL = 'https://www.goodreads.com/review/list/123';
        mock.onGet(`${baseURL}&page=1`).networkError();
        const result = await (0, data_1.getAllPages)(baseURL);
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalled();
    });
    it('handles rate limiting', async () => {
        const baseURL = 'https://www.goodreads.com/review/list/123';
        mock.onGet(`${baseURL}&page=1`).reply(429);
        const result = await (0, data_1.getAllPages)(baseURL);
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Failed to fetch page 1:', expect.stringContaining('429'));
    });
});
//# sourceMappingURL=getAllPages.test.js.map