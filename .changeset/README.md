# Changesets in this repository

This repository uses [Changesets](https://github.com/changesets/changesets) for release notes, package versioning, and npm publishing.

## Quick start

1. Run `npm run changeset` from the repository root.
2. Select each published package affected by your change.
3. Choose the correct bump type (`patch`, `minor`, or `major`).
4. Write a short summary describing the consumer-facing impact.
5. Commit the generated `.changeset/*.md` file with the related change.

## Repository-specific rules

- The base branch is `master`.
- Packages are published with public access.
- Internal workspace dependency ranges are updated with a patch bump when needed.
- Version updates are not auto-committed by Changesets; they are handled through the normal release PR flow.

## Release flow

- Merge changesets to `master` through the usual pull request process.
- The publish workflow runs `changesets/action`.
- If release notes are pending, the workflow opens or updates a release PR.
- If versioned packages are ready and unpublished, the workflow runs `npm run release`.

For the full contributor workflow, script reference, and CI details, see [`../CONTRIBUTING.md`](../CONTRIBUTING.md).
