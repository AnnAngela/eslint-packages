#!/usr/bin/env bash
set -euo pipefail

PACKAGE_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
ROOT_DIR="$(cd -- "${PACKAGE_DIR}/../.." && pwd)"
cd "$ROOT_DIR"

echo ----
echo Prepare the environment
mkdir -pv .cache
rm -f .cache/summary.md
touch .cache/summary.md
export GITHUB_STEP_SUMMARY=.cache/summary.md
export GITHUB_SHA=114514191981019260817536
export GITHUB_REPOSITORY=AnnAngela/eslint-packages
echo ---
echo Build the formatter
cd "$PACKAGE_DIR"
npm run build
cd -
echo ---
echo Run the formatter
npx eslint --format ./packages/eslint-formatter-gha/dist/index.js .
echo Done.
echo ---
