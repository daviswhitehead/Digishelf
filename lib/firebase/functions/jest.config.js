"use strict";
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/sources'],
    collectCoverageFrom: [
        'sources/**/*.{js,ts}',
        '!sources/**/*.d.ts',
        '!sources/**/__tests__/**',
        '!sources/**/__fixtures__/**',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    coverageReporters: ['text', 'lcov', 'html'],
    testMatch: ['**/__tests__/**/*.test.ts'],
};
//# sourceMappingURL=jest.config.js.map