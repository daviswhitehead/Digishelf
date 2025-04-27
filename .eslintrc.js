module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'google', 'prettier'],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-restricted-globals': 'off',
    'prefer-arrow-callback': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    quotes: ['error', 'single'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
  ignorePatterns: ['node_modules/', 'lib/', 'dist/', '.next/', 'coverage/', '*.d.ts'],
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js'],
      env: {
        jest: true,
      },
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
