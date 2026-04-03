#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo ----
echo Prepare the environment
mkdir -pv .cache
rm -f .cache/summary.md
touch .cache/summary.md
export GITHUB_STEP_SUMMARY=.cache/summary.md
export GITHUB_SHA=123456789012345678901234
export GITHUB_REPOSITORY=asd/dsa
echo ---
echo Build the formatter
cd packages/eslint-formatter-gha
npm run build
cd -
echo ---
echo Run the formatter
npx eslint --format ./packages/eslint-formatter-gha/dist/index.js .
echo Done.
echo ---
