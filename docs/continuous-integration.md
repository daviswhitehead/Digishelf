# Continuous Integration

> This document outlines the three core CI/CD milestones, designed to help catch issues early, prevent regressions, and ensure a reliable production app.

## Goals

- Prevent regressions from reaching production
- Give fast feedback loops during dev
- Build confidence to ship quickly and often
- Ensure code is legible and future iteration is easy

## Upon Local Code Commit

**Purpose:** Catch obvious issues quickly before code reaches GitHub.

**Checks:**

- Lint changed files
- Format staged files
- Run Jest tests on staged files
- Prevent commits with `.only` or `.skip` in tests

**Tools:**

- Husky (pre-commit hook)
- lint-staged
- ESLint
- Prettier
- Jest

## Upon Pull Request

**Purpose:** Validate new code before merging into `main`.

**Checks:**

- Install and build for web (`next build`)
- Type check the entire repo (`tsc`)
- Lint and format all files
- Run full Jest test suite
- Run responsive checks (Percy) on key views at mobile/tablet/desktop sizes
- Run AI-assisted code review
- Build iOS (`eas build --platform ios --local`)
- Build Android (`eas build --platform android --local`)

**Tools:**

- GitHub Actions
- ESLint
- Prettier
- tsc (TypeScript compiler)
- Jest
- Percy (for visual diff + responsive testing)
- OpenAI + custom script (for AI review)
- Expo CLI / EAS CLI (for native builds)

## Upon Production Deployment

**Purpose:** Ensure the production site is stable and healthy.

**Checks:**

- Build Next.js production bundle
- Confirm SSR routes render without error
- Deploy to Firebase Hosting
- Run Lighthouse performance audit (alert if score drops)
- Run smoke tests with Playwright
- Send deployment status via webhook

**Tools:**

- GitHub Actions
- Firebase CLI
- Next.js
- Lighthouse CI
- Playwright (for smoke tests)
- Slack/Discord/webhook (for alerts)

## Glossary of Tools

- **GitHub Actions**: Automates CI workflows such as testing, linting, and deployment.
- **Husky**: Enables Git hooks to run scripts like linters and tests before commits.
- **lint-staged**: Runs linters or other scripts only on staged files before committing.
- **ESLint**: Analyzes JavaScript/TypeScript code to catch syntax and quality issues.
- **Prettier**: Automatically formats code according to defined style rules.
- **Jest**: A JavaScript testing framework for running unit and integration tests.
- **tsc (TypeScript compiler)**: Checks and compiles TypeScript files to JavaScript.
- **Percy**: Provides visual regression testing across responsive screen sizes.
- **OpenAI + custom script**: Runs AI-assisted reviews to highlight opportunities for code improvement.
- **Expo CLI / EAS CLI**: Tools to build and deploy React Native apps to iOS and Android.
- **Firebase CLI**: Deploys your app and server functions to Firebase Hosting.
- **Next.js**: A React-based framework for building web apps with SSR and static site generation.
- **Lighthouse CI**: Runs performance audits on deployed web apps and flags regressions.
- **Playwright**: Automates browser-based testing to simulate user interactions for smoke or end-to-end tests.
- **Slack/Discord/webhook**: Sends deployment or alert messages to communication channels.
