# Contributing

Thanks for contributing to `AnnAngela/eslint-packages`.

This document explains the repository-level configuration and the standard workflows for development, validation, versioning, and publishing. Package consumer usage stays in each package's own README; this guide focuses on maintaining the monorepo itself.

## Requirements

- Node.js: `^20.19 || ^22.21 || ^24.11`
- npm: the version bundled with the supported Node.js runtime is sufficient
- Operating directory: run repository-level commands from the repository root unless a command explicitly says otherwise

## Repository Layout

- `packages/eslint-config` — shared ESLint flat-config presets and exported tsconfig files
- `packages/eslint-formatter-gha` — custom formatter used by GitHub Actions jobs
- `packages/eslint-plugin-prefer-reflect` — ESLint plugin package
- `.changeset` — release-note entries and Changesets configuration
- `scripts` — repository maintenance helpers used by npm scripts and CI
- `.github/workflows` — linting, publishing, and security automation

## Initial Setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. If you update package metadata and want to normalize derived fields afterwards, run `npm run sync:packages`.

`npm install` prepares the workspace dependencies. The repository does not rely on manual per-package bootstrapping.

## Script Reference

### Main repository scripts

| Command | Purpose | Notes |
| --- | --- | --- |
| `npm run changeset` | Open the Changesets prompt and create a new `.changeset/*.md` file | Use for user-facing package changes that should affect versioning or changelogs |
| `npm run version` | Apply pending changesets locally | Updates package versions and changelog files; normally used by the release PR flow |
| `npm run release` | Build all publishable packages and publish unpublished versions | Intended for controlled publishing, mainly through CI |
| `npm run build` | Build all workspaces | Runs each package build through npm workspaces |
| `npm run lint` | Run local lint validation | Checks package metadata, builds the prefer-reflect plugin, lints all workspaces, then lints the repository root |
| `npm run lint:ci` | Run CI-style lint validation | Uses the GitHub Actions formatter after building the formatter package |
| `npm run lint:ci:run` | Execute the lint commands after CI prerequisites are already prepared | Useful when build/check steps were already completed earlier in the job |
| `npm run test` | Run all workspace tests | Delegates to package-level test scripts |
| `npm run verify` | Run the standard full verification flow | Equivalent to package metadata check + build + CI-style lint + tests |
| `npm run sync:packages` | Rewrite derived package metadata when drift is found | Updates package-level `package.json` files in place |
| `npm run check:packages` | Detect derived metadata drift without modifying files | Fails when synchronized metadata differs from committed files |
| `npm run verify:packages` | Alias of `npm run check:packages` | Keeps CI and local naming consistent |
| `npm run lint:check` | Alias of `npm run lint` | Compatibility entry point |
| `npm run lint:check-ci` | Alias of `npm run lint:ci` | Compatibility entry point |
| `npm run lint:write` | Run ESLint auto-fixes from the repository root | Convenience command for formatting/fixable lint issues |
| `npm run ci` | Recreate a CI-like install flow locally | Reinstalls dependencies and temporarily normalizes package-lock registry URLs for install reliability |
| `npm run package` | Alias of `npm run build` | Compatibility entry point |
| `npm run test:eslint-plugin-prefer-reflect` | Run only the prefer-reflect package tests | Compatibility entry point |
| `npm run test:eslint-formatter-gha:lint` | Run only the formatter test script | Compatibility entry point |

### Package-level scripts

Each package also exposes its own `build`, `lint`, `test`, `package`, `preversion`, and `version` scripts.

- `build` produces the distributable files for that package.
- `lint` validates only that package's source tree.
- `test` runs only that package's tests.
- `package` is an alias of the package build script.
- `preversion` runs package linting before a version bump inside that package.
- `version` runs the package build during package versioning.

Run package-specific scripts from the repository root with npm workspaces:

```bash
npm run build --workspace=@annangela/eslint-config
npm run lint --workspace=@annangela/eslint-formatter-gha
npm run test --workspace=@annangela/eslint-plugin-prefer-reflect
```

## Package Metadata Synchronization

The repository keeps several `packages/*/package.json` fields derived from the root configuration instead of editing every package manually.

`npm run sync:packages` and `npm run check:packages` are backed by `scripts/postinstall.js`. That script currently verifies or synchronizes:

- `repository.directory`
- `homepage`
- `exports`
- dependency ranges inherited from the installed root dependency versions
- local workspace dependency ranges
- `engines.node`
- relevant `overrides` copied from the root package

Use `npm run check:packages` when you only want to confirm the repository is clean. Use `npm run sync:packages` after intentionally changing root dependency or package metadata so the package manifests are regenerated consistently.

## Recommended Local Workflow

For most code or documentation changes:

1. Make the necessary changes.
2. If package metadata or dependency versions were touched, run `npm run sync:packages`.
3. Run `npm run verify`.
4. Add a changeset when the change should affect a published package version or changelog.

If you only need a narrower check while iterating, run the relevant package-scoped `build`, `lint`, or `test` script first, then finish with `npm run verify` before opening a pull request.

## Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to manage release notes, package versions, and publishing.

### Current repository configuration

The `.changeset/config.json` file currently means:

- `baseBranch: "master"` — release automation compares pending release work against `master`
- `access: "public"` — published packages are released as public npm packages
- `updateInternalDependencies: "patch"` — when a package depends on another local package that was versioned, its dependency range is patched forward
- `commit: false` — Changesets does not auto-commit generated version updates
- `fixed`, `linked`, and `ignore` are empty — packages are versioned independently unless a changeset explicitly includes multiple packages

### When to add a changeset

Add a changeset for changes that should be visible to package consumers, such as:

- new features
- fixes that affect published behavior
- breaking changes
- documentation changes that need to appear in package changelogs

Do not add a changeset for repository-only maintenance that does not change a published package.

### How to write a changeset

1. Run `npm run changeset` from the repository root.
2. Select every published package affected by the change.
3. Choose the appropriate bump type:
   - `patch` for backward-compatible fixes and small improvements
   - `minor` for backward-compatible features
   - `major` for breaking changes
4. Write a concise summary that explains the consumer-facing impact.
5. Commit the generated `.changeset/*.md` file together with the related code or documentation changes.

Each changeset file contains front matter describing the package bumps and a short markdown summary used later for changelog generation.

### Reviewing pending changesets locally

- Run `npm run version` to apply all pending changesets locally.
- Review the updated package versions and changelog entries.
- If you only wanted to inspect the output, revert the generated version/changelog files afterwards.

The repository-specific `.changeset/README.md` file provides a short quick reference for the same process.

## Release and Publish Flow

Publishing is driven by `.github/workflows/npm-publish.yml`.

### Automatic flow on `master`

When commits land on `master`, the publish workflow:

1. checks out the repository and installs dependencies
2. runs `npm run verify`
3. summarizes pending changesets when they exist
4. runs `changesets/action`

From there, Changesets does one of two things:

- opens or updates a release PR containing the output of `npm run version`, or
- runs `npm run release` to publish any versioned packages that are not yet on npm

### Local release commands

- Use `npm run version` when you intentionally want to preview or regenerate release artifacts locally.
- Use `npm run release` only when you deliberately want to publish unpublished package versions.
- Do not use `scripts/newTag.js`; it is kept only to point contributors to the Changesets-based flow and exits with an error.

## CI and Validation

### Lint workflow

`.github/workflows/linter.yaml` runs on matching pushes, pull requests, merge queues, manual dispatches, and a schedule.

Its main validation entry point is `npm run verify`, so the local command and the GitHub workflow check the same high-level steps:

1. package metadata validation
2. workspace builds
3. linting with the GitHub Actions formatter
4. workspace tests

The workflow skips the heavy validation steps for generated release commits that match the repository's release-commit naming pattern.

### Publish workflow

`.github/workflows/npm-publish.yml` also runs `npm run verify` before it attempts release PR creation or publishing. If local `npm run verify` passes, you are exercising the same main validation path used by release automation.

### Formatter test script

`npm run test --workspace=@annangela/eslint-formatter-gha` executes `scripts/eslint-formatter-gha.test.sh`, which:

1. prepares a local summary file and GitHub Actions-like environment variables
2. rebuilds the formatter package
3. runs ESLint with the formatter against the repository

This validates the formatter behavior without needing a real GitHub Actions runner.

## Notes and Pitfalls

- Run repository-level commands from the root unless a package README says otherwise.
- If `npm run check:packages` fails, prefer `npm run sync:packages` instead of hand-editing derived fields.
- If you need to inspect release output locally, use `npm run version`; do not create tags or try to revive the deprecated legacy publish script.
- Before opening a pull request, prefer `npm run verify` over running isolated commands one by one.
