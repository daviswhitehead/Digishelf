# Contributing to Digishelf

## Git Workflow

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear and machine-readable commit messages. Each commit message should be structured as follows:

```
type(scope): description

[optional body]
[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

**Examples:**

```
feat(auth): add Google sign-in
fix(shelf): resolve item sorting issue
docs(api): update Firebase function documentation
```

### Git Hooks

We use Husky to enforce code quality and consistency. The following hooks are configured:

#### Pre-commit Hook (Non-blocking)

Runs on `git commit` and checks:

- Formats staged files with Prettier
- Lints staged files with ESLint
- Type checks staged files

Even if issues are found, the commit will proceed, but you should fix the issues before pushing.

To run checks manually:

```bash
npm run lint:fix    # Fix lint issues
npm run format      # Fix formatting
npm run type-check  # Check types
```

#### Commit Message Hook (Blocking)

Runs on `git commit` and:

- Enforces conventional commit message format
- Must pass for commit to proceed

#### Pre-push Hook (Blocking)

Runs on `git push` and performs:

- Full type checking
- Full lint check
- Runs tests for affected components:
  - Functions tests if `firebase/functions/` files changed
  - App tests if `app/` files changed

Must pass all checks for push to proceed.

### Skipping Hooks

While not recommended, you can skip hooks if necessary:

```bash
git commit -m "..." --no-verify  # Skip pre-commit and commit-msg hooks
git push --no-verify             # Skip pre-push hook
```

⚠️ **Note**: Skipping hooks should be done with caution. The CI pipeline will still run all checks.

### Common Issues

1. **Type Errors**

   - Error: Type check failed
   - Fix: Run `npm run type-check` to see errors
   - Fix type issues or add appropriate type definitions

2. **Lint Errors**

   - Error: Lint check failed
   - Fix: Run `npm run lint:fix` to automatically fix issues
   - Review remaining issues and fix manually if needed

3. **Invalid Commit Message**

   - Error: Invalid commit message format
   - Fix: Follow the conventional commit format
   - Use the examples provided in the error message

4. **Failed Tests**
   - Error: Tests failed in pre-push
   - Fix: Run `npm test` locally to debug
   - Fix failing tests before pushing

### Best Practices

1. **Commit Early, Commit Often**

   - Make small, focused commits
   - Use clear commit messages
   - Push regularly to avoid large pre-push checks

2. **Keep Dependencies Updated**

   - Run `npm install` after pulling changes
   - This ensures Husky hooks are properly installed

3. **Before Pushing**
   - Run checks manually if you've skipped them
   - Review changes with `git diff`
   - Consider running full test suite locally

### CI/CD Pipeline

The Git hooks complement our CI/CD pipeline:

- Hooks provide fast, local feedback
- CI runs full, clean-environment checks
- Both help maintain code quality

For more information about our CI/CD setup, see the GitHub Actions workflows in `.github/workflows/`.
