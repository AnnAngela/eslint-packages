console.error("scripts/newTag.js is deprecated.");
console.error("Use Changesets from the repository root instead:");
console.error("  1. npm run changeset");
console.error("  2. Merge the resulting changeset through the normal PR flow");
console.error("  3. Let the publish workflow run npm run version / npm run release on master");
process.exitCode = 1;
