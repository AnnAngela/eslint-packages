# @annangela/eslint-config

ESLint config for AnnAngela's projects, supports the latest Node.js LTS version.

## Output

There are 4 exported variables, both via named export and default export:

* `baseConfig`: base config for all javascript files;
* `browserConfig`: additional config for browser files;
* `nodeConfig`: additional config for Node.js files;
* `typescriptConfig`: additional config for typescript files.

You can view the config in the variable `config` of [./eslint.config.js](https://github.com/AnnAngela/eslint-config/blob/master/eslint.config.js).

The config variables are marked via inline comments.

### other files

The package also exported these files:

* [./forkedGlobals.js](https://github.com/AnnAngela/eslint-config/blob/master/forkedGlobals.js)
* [./tsconfig.json](https://github.com/AnnAngela/eslint-config/blob/master/tsconfig.json)

## Build

Just run:

```bash
npm run package
```

The sources files are `./index.js`, `./eslint.config.js` (which is the eslint config for this repo too) and `./globals.json` (contains required globals environment variables [deprecated by "globals" package](https://github.com/sindresorhus/globals/issues/82)).

The outputs are in the `./lib/` folder.

The folder `./lib/cjs/` contains the compiled files in CommonJS format.
