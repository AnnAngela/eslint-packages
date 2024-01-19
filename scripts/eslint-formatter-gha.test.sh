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
npm run package
cd -
echo ---
echo Run the formatter
npx eslint --format ./packages/eslint-formatter-gha/dist/index.js .
echo Done.
echo ---
