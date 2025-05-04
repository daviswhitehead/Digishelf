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
  settings: {
    next: {
      rootDir: 'app/',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'google',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:@next/next/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier', '@next/next'],
  rules: {
    'prettier/prettier': 'error',
    'no-restricted-globals': 'off',
    'prefer-arrow-callback': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-html-link-for-pages': ['error', { pagePath: 'app/pages' }],
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
    {
      // Special rules for JavaScript files
      files: ['**/*.js'],
      env: {
        node: true,
        es6: true,
      },
      rules: {
        camelcase: 'off',
        '@typescript-eslint/camelcase': 'off',
        'no-invalid-this': 'off',
        // Allow require syntax in .js files
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
