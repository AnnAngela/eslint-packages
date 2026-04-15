# @annangela/eslint-config

## 11.1.0

### Minor Changes

- c59663b: fix(node): add rule to prevent missing imports

## 11.0.0

### Major Changes

- 8758304: update eslint peer dependency to ^10.0.0 ONLY

## 10.0.0

### BEAKING CHANGES

- 适配 TypeScript 6.0 版本：
  - [`packages/eslint-config/src/tsconfigs/tsconfig.base.json`](packages/eslint-config/src/tsconfigs/tsconfig.base.json) 中显式声明 `compilerOptions.types` 为 `["*"]` ：
    > 在 TypeScript 6.0 中，`types` 的默认值从 `["*"]` 更改为 `[]`，这意味着默认情况下，除非显式指定，否则不会包含任何类型声明文件。进行这一更改是为了提升性能，并降低意外包含不需要的类型声明的可能性。更多信息请参阅 TypeScript 6.0 发布说明：[`types` now defaults to `[]`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#types-now-defaults-to-)。
  - [`packages/eslint-config/src/tsconfigs/tsconfig.browser.json`](packages/eslint-config/src/tsconfigs/tsconfig.browser.json) 中的 `compilerOptions.module` 从 `"none"` 改为 `"preserve"`：
    > 在 TypeScript 6.0 中，`module` 允许的值中，`amd`、`umd`、`systemjs` 和 `none` 已被废弃，参阅 TypeScript 6.0 发布说明：[Deprecated: `amd`, `umd`, and `systemjs` values of `module`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated-amd-umd-and-systemjs-values-of-module)。
  - [`packages/eslint-config/src/tsconfigs/tsconfig.node20.cjs.json`](packages/eslint-config/src/tsconfigs/tsconfig.node20.cjs.json)、[`packages/eslint-config/src/tsconfigs/tsconfig.node22.cjs.json`](packages/eslint-config/src/tsconfigs/tsconfig.node22.cjs.json)、[`packages/eslint-config/src/tsconfigs/tsconfig.node24.cjs.json`](packages/eslint-config/src/tsconfigs/tsconfig.node24.cjs.json) 和 [`packages/eslint-config/src/tsconfigs/tsconfig.browser.json`](packages/eslint-config/src/tsconfigs/tsconfig.browser.json) 中的 `compilerOptions.moduleResolution` 改为 `"bundler"`：
    > 在 TypeScript 6.0 中，`moduleResolution` 允许的值中，`classic` 已被删除，而 `node` 和 `node10` 已被废弃，，参阅 TypeScript 6.0 发布说明：[Deprecated: `--moduleResolution node` (a.k.a. `--moduleResolution node10`)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---moduleresolution-node-aka---moduleresolution-node10)；
    > 对于 commonjs 项目来说，现在可用的 `moduleResolution` 值仅剩 `bundler`，TypeScript 官方也在发布说明中提及这一组合，参阅：[Combining `--moduleResolution bundler` with `--module commonjs`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#combining---moduleresolution-bundler-with---module-commonjs)。
- [`packages/eslint-config/src/configs/base.js`](packages/eslint-config/src/configs/base.js) 中的 `languageOptions.ecmaVersion` 和 `languageOptions.parserOptions.ecmaVersion` 从 `2022` 升级到 `2024`，`languageOptions.globals` 从 `es2022` 升级到 `es2024`；
- 修正了 `"./tsconfig.node20.json"` 的错误导出，之前该导出错误地指向了 `"./dist/tsconfigs/tsconfig.node24.json"`，现在已修正为正确的 `"./dist/tsconfigs/tsconfig.node20.json"`。

### NOTABLE CHANGES

- 依赖项 `@typescript-eslint/eslint-plugin` 和 `@typescript-eslint/parser` 升级到 `^8.57.0`，这是这些依赖项第一个支持 TypeScript 6.0 的版本；
- 修正了多个 tsconfig.json 里不匹配的 `display` 和 `_version` 字段。
