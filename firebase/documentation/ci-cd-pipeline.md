# Digishelf CI/CD Pipeline

This document outlines the continuous integration and deployment (CI/CD) pipeline for Digishelf, split between local development checks and cloud-based validation.

## Local Development (Husky)

Pre-commit hooks ensure code quality before changes enter the repository. These checks are fast and focused.

### Pre-commit Checks
- **Linting**: ESLint on changed files
- **Type Checking**: Quick TypeScript validation
- **Unit Tests**: Tests related to changed files only
- **Code Formatting**: Prettier, import sorting

### Configuration
- Located in `.husky/pre-commit`
- Configured via `lint-staged` in `package.json`
- Runs only on staged files for speed

## GitHub Actions Pipeline

Comprehensive validation running in the cloud after code is pushed.

### Pull Request Checks
1. **Full Test Suite**
   - All unit tests
   - Integration tests
   - Coverage reporting (minimum 80%)
   - Multi-node version testing

2. **Static Analysis**
   - Complete TypeScript compilation
   - Full ESLint check
   - Security scanning
   - Dependency auditing
   - Code quality metrics

3. **Build Verification**
   - Full build process
   - Bundle analysis
   - Type generation
   - Asset optimization

### Pre-deployment Validation
1. **Environment Checks**
   - Environment variable validation
   - Firebase config verification
   - API compatibility
   - Database schema validation

2. **Security Checks**
   - Dependency vulnerabilities
   - Code scanning alerts
   - Secret scanning
   - License compliance

## Deployment Flow

1. **Local Development**
   ```
   Make changes → Husky checks → Commit → Push
   ```

2. **Feature Branch**
   ```
   GitHub Actions → Full validation → PR creation
   ```

3. **Pull Request**
   ```
   Review → All checks pass → Merge
   ```

4. **Main Branch**
   ```
   Final validation → Staging deploy → Smoke tests
   ```

5. **Production**
   ```
   Manual approval → Security checks → Production deploy
   ```

## Coverage Requirements

All code must maintain:
- Statements: 80% minimum
- Branches: 80% minimum
- Functions: 80% minimum
- Lines: 80% minimum

## Monitoring

- Test results reported in PR comments
- Coverage reports generated
- Bundle size changes tracked
- Security alerts monitored

## Configuration Files

- `.github/workflows/`: GitHub Actions workflow definitions
- `.husky/`: Local git hooks
- `firebase/functions/package.json`: NPM scripts and hooks
- `jest.config.js`: Test configuration
- `.eslintrc.js`: Linting rules 