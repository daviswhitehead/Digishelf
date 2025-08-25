# Tech Stack

> This document outlines the technologies used in the product, organized by platform and function. It reflects current tooling as well as emerging integrations in progress.

---

## 🌐 Frontend (Web, iOS & Android)

**Framework:**

- [Expo](https://expo.dev) — Cross-platform framework for building and deploying apps to iOS, Android, and Web from a single codebase.
- [Next.js](https://nextjs.org) — Handles SSR and routing for the web layer.
- [Solito](https://github.com/nandorojo/solito) — Lightweight toolkit that bridges navigation and screen rendering between Next.js and Expo for true cross-platform parity.

**Styling:**

- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework used for both web and native (as a dependency of NativeWind).
- [NativeWind](https://www.nativewind.dev/) — Tailwind-compatible styling engine for React Native that bridges styles across platforms.

**Tooling:**

- [TypeScript](https://www.typescriptlang.org) — Type-safe JavaScript for all frontend code.
- [ESLint](https://eslint.org) + [Prettier](https://prettier.io) — Code quality and formatting.
- [Jest](https://jestjs.io) — Unit and integration testing.
- [Percy](https://percy.io) — Responsive and visual regression testing.
- [Playwright](https://playwright.dev) — Smoke testing in real browsers.

**Design Considerations:**

- Mobile-first responsive layout
- Cross-platform design with web and native parity
- Emphasis on accessibility and performance

---

## 🔧 Backend / Infrastructure

**Authentication & Database:**

- [Firebase Auth](https://firebase.google.com/products/auth) — Auth provider for all platforms.
- [Firestore](https://firebase.google.com/products/firestore) — Realtime NoSQL database.

**Functions & APIs:**

- [Firebase Functions](https://firebase.google.com/products/functions) — Serverless backend for data scraping, task automation, and secure endpoints.
- [OpenAI SDK](https://platform.openai.com/docs) — AI reviews and content enhancements.

**CI/CD & Hosting:**

- [GitHub Actions](https://github.com/features/actions) — Automates testing, linting, and deployments.
- [Firebase Hosting](https://firebase.google.com/products/hosting) — Serves web and app bundles.
- [Expo CLI / EAS CLI](https://docs.expo.dev) — Native app packaging and build pipeline.
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) — Performance audits and alerts.

**Monitoring:**

- (Planned) Error monitoring tool for catching runtime issues.

---

## 🧪 Developer Experience & Productivity

**Local Dev:**

- [TypeScript](https://www.typescriptlang.org) — Strongly typed JavaScript used across the entire codebase for frontend, backend, and CI scripts.
- Shared `tsconfig.json` at root, with workspace-specific extensions in `app/` and `firebase/functions/`.
- Monorepo with separate workspaces for `app/`, `firebase/functions/`, and root config.
- `.nvmrc`, `.eslintrc`, `.prettierrc`, and workspace-based `package.json`s.
- [Storybook](https://storybook.js.org) — For isolated UI development and visual documentation across platforms.

**Tooling & Automation:**

- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged) — Pre-commit hooks.
- [pnpm](https://pnpm.io) (optional future) — For faster monorepo install and deduping.

---

## 📦 Deployment Targets

- **Web** — Built with Expo + Next.js and deployed via Firebase Hosting or Vercel.
- **iOS & Android** — Built and submitted using EAS CLI and deployed through the App Store / Play Store.
- **Preview URLs** — (Planned) Firebase or Vercel preview environments generated per pull request.

---

## 🚧 In Progress / Considered

- Error monitoring (e.g., Sentry, LogRocket)
- Automated changelog generation
- Semantic versioning with tags
