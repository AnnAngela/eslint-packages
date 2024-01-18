# @annangela/eslint-config

ESLint config for AnnAngela's projects, supports the latest Node.js LTS version.

## Output

There are 2 exported variables, both via named export and default export:

* `configs`: contains these configs (see in the [config folder](src/configs)):
  * `base`: base config for all javascript files;
  * `browser`: additional config for browser files;
  * `node`: additional config for Node.js files;
  * `typescript`: additional config for typescript files;
  * `eslintPlugin`: additional config for eslint-plugin files;
  * `mocha`: additional config for mocha test files.
* `forkedGlobals`: contains these forked globals from [globals](https://github.com/sindresorhus/globals/blob/v13.24.0/globals.json) (see [forkedGlobals.js](src/forkedGlobals.js)):
  * `jquery`;
  * `greasemonkey`;
  * `mocha`;

### other files

The package also exported these files:

* [./tsconfig.browser.json](src/tsconfigs/tsconfig.browser.json)
* [./tsconfig.node20.json](src/tsconfigs/tsconfig.node20.json)
