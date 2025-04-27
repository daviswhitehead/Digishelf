import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/sources', '<rootDir>/handlers', '<rootDir>/shared'],
  setupFilesAfterEnv: ['<rootDir>/test/helpers/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: [
    '**/__tests__/unit/**/*.test.ts',
    '**/__tests__/integration/**/*.test.ts'
  ],
  moduleNameMapper: {
    '^@test/(.*)$': '<rootDir>/test/$1',
    '^@sources/(.*)$': '<rootDir>/sources/$1',
    '^@handlers/(.*)$': '<rootDir>/handlers/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
    }],
  },
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  collectCoverageFrom: [
    'sources/**/*.ts',
    'handlers/**/*.ts',
    'shared/**/*.ts',
    '!**/__tests__/**',
    '!**/__fixtures__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
