# @annangela/eslint-config

## 14.0.0

### Major Changes

- 58efb89: **ESLint v10 适配：升级 @eslint/js 与添加 peerDependencies**

  - **`@annangela/eslint-config` (major)**：升级 `@eslint/js` 从 v9.39.4 到 v10.0.1，引入 3 个新推荐规则：
    - `no-unassigned-vars`：禁止声明后从未赋值的变量
    - `no-useless-assignment`：禁止无效的赋值操作
    - `preserve-caught-error`：强制在 `catch` 子句中引用错误对象
    - 恢复 `@eslint/js/recommended` 配置的 `name` 属性
    - 新增 `engines.node: ^20.19.0 || ^22.13.0 || >=24`
  - **`@annangela/eslint-formatter-gha` (minor)**：新增 `peerDependencies.eslint: ^10.0.0`，遵循 ESLint 官方插件开发规范，明确与宿主工具的兼容范围
  - **`@annangela/eslint-plugin-prefer-reflect` (minor)**：新增 `peerDependencies.eslint: ^10.0.0`，同上

  ***

  **ESLint v10 support: @eslint/js upgrade and peerDependencies**

  - **`@annangela/eslint-config` (major)**: Upgraded `@eslint/js` from v9.39.4 to v10.0.1, introducing 3 new recommended rules:
    - `no-unassigned-vars`: disallows variables that are declared but never assigned
    - `no-useless-assignment`: disallows assignments that have no effect
    - `preserve-caught-error`: enforces referencing the error object in `catch` clauses
    - Restored the `name` property on the `@eslint/js/recommended` config
    - Added `engines.node: ^20.19.0 || ^22.13.0 || >=24`
  - **`@annangela/eslint-formatter-gha` (minor)**: Added `peerDependencies.eslint: ^10.0.0`, following ESLint's official plugin development guidelines to express compatibility with the host tool
  - **`@annangela/eslint-plugin-prefer-reflect` (minor)**: Added `peerDependencies.eslint: ^10.0.0`, same as above

### Patch Changes

- da9c6fe: **代码质量优化：移除冗余规则、新增 API 别名与文档增强**

  - **`@annangela/eslint-config` (patch)**：移除 `node` 配置中 3 条冗余的 `n/no-unsupported-features/*` 规则（`eslint-plugin-n` 的 `flat/recommended-module` 配置已自带这些规则，且默认支持从 `engines.node` 自动检测版本）
  - **`@annangela/eslint-formatter-gha` (minor)**：
    - 新增 `addSeparator()` 方法作为拼写正确的公开 API，原有 `addSeperator()` 标记为 deprecated
    - `ActionsSummary.wrap()` 方法中的 HTML 属性值现已进行实体转义（`&`、`"`、`<`、`>`）
  - **`@annangela/eslint-plugin-prefer-reflect` (patch)**：
    - 在中英文文档中增加了 `Object.getOwnPropertyNames` → `Reflect.ownKeys` 替换的语义差异警告（Symbol 键）
    - 提取 `EXCEPTION_NAMES` 共享常量，减少 schema 与方法名映射之间的重复

  ***

  **Code quality improvements: redundant rules removal, new API alias, and documentation enhancement**

  - **`@annangela/eslint-config` (patch)**: Removed 3 redundant `n/no-unsupported-features/*` rules from `node` config — `eslint-plugin-n`'s `flat/recommended-module` already includes them with auto-detection from `engines.node`
  - **`@annangela/eslint-formatter-gha` (minor)**:
    - Added `addSeparator()` as the correctly spelled public API; `addSeperator()` is now deprecated
    - HTML attribute values in `ActionsSummary.wrap()` are now entity-escaped (`&`, `"`, `<`, `>`)
  - **`@annangela/eslint-plugin-prefer-reflect` (patch)**:
    - Added semantic difference warning for `Object.getOwnPropertyNames` → `Reflect.ownKeys` in both Chinese and English documentation
    - Extracted `EXCEPTION_NAMES` shared constant to reduce duplication across schema and method name mappings

- 58efb89: **文档与注释完善**

  - **`@annangela/eslint-plugin-prefer-reflect`**：
    - 补充 `delete` 非成员 suggestion 的语义取舍说明
    - 补充 `CallExpression` visitor 架构注释，说明四个分支不可合并的设计决策
  - **`@annangela/eslint-config`**：
    - README 补充安装说明和 Flat Config 使用示例
    - 修正 `forkedGlobals.js` 中 `false`/`true` 值的含义说明
    - 补充测试中循环依赖引用路径的注释
  - **`@annangela/eslint-formatter-gha`**：
    - README 优化截图描述文字和默认值表格
    - `tsconfig.build.json` 添加用途注释
  - **通用**：
    - `CONTRIBUTING.md` 修正已删除的 `test` 命令残留引用，精确描述 `verify` 与 `verify:ci` 的差异，补充 formatter smoke test 目录说明
    - `SECURITY.md` 新增 `pnpm audit` 审计命令
    - 所有 Shell 代码块统一为 `bash` 标记，安装命令风格统一为 `npm install`

  ***

  **Documentation and comment improvements**

  - **`@annangela/eslint-plugin-prefer-reflect`**:
    - Added documentation explaining the semantic trade-off of the `delete` non-member suggestion
    - Added architecture comments for the `CallExpression` visitor, explaining why the four branches are intentionally kept separate
  - **`@annangela/eslint-config`**:
    - Added installation instructions and Flat Config usage examples to the README
    - Documented the meaning of `false`/`true` values in `forkedGlobals.js`
    - Added a comment explaining the circular dependency import path in the test file
  - **`@annangela/eslint-formatter-gha`**:
    - Improved README screenshot descriptions and defaults table
    - Added a purpose comment to `tsconfig.build.json`
  - **General**:
    - `CONTRIBUTING.md`: fixed stale `test` command reference, clarified the difference between `verify` and `verify:ci`, added smoke test directory documentation
    - `SECURITY.md`: added `pnpm audit` command
    - Unified all Shell code blocks to use the `bash` language tag and installation commands to `npm install`

- cac9df3: **修正拼写错误、死代码与构建产物**

  - **`@annangela/eslint-config` (patch)**：
    - 修正 `browser` 配置中 `parserOptions.sourceType` 不一致的问题，统一为 `"script"` 模式
    - 注释掉 `typescript` 配置中无效的 `eslint-recommended` 规则展开（eslintrc 格式使用 `overrides` 而非 `rules`，该展开为空操作）
  - **`@annangela/eslint-formatter-gha` (patch)**：修正已弃用规则严重级别警告消息中的多余 "it" 语法错误
  - **`@annangela/eslint-plugin-prefer-reflect` (patch)**：修正 schema 中 `exceptions` 属性的拼写错误（"Execptions" → "Exceptions"）

  ***

  **Fix typos, dead code, and build artifacts**

  - **`@annangela/eslint-config` (patch)**:
    - Fixed inconsistent `parserOptions.sourceType` in `browser` config — now unified to `"script"`
    - Commented out dead `eslint-recommended` config spread in `typescript` config (eslintrc format uses `overrides`, not `rules` — the spread was a no-op)
  - **`@annangela/eslint-formatter-gha` (patch)**: Fixed extra "it" in the deprecated rules severity warning message
  - **`@annangela/eslint-plugin-prefer-reflect` (patch)**: Fixed schema typo in `exceptions` property description ("Execptions" → "Exceptions")

- Updated dependencies [da9c6fe]
- Updated dependencies [58efb89]
- Updated dependencies [58efb89]
- Updated dependencies [cac9df3]
- Updated dependencies [58efb89]
- Updated dependencies [58efb89]
  - @annangela/eslint-plugin-prefer-reflect@6.1.0

## 13.0.0

### Major Changes

- ce382b2: 移除了对 Node.js 20 的支持，所有包现在仅支持 Node.js 22 和 Node.js 24。

  `@annangela/eslint-config` 同时移除了 `./tsconfig.node20.json` 与 `./tsconfig.node20.cjs.json` 导出。

### Patch Changes

- Updated dependencies [ce382b2]
  - @annangela/eslint-plugin-prefer-reflect@6.0.0

## 12.0.0

### Major Changes

- 458d765: npm(deps): bump eslint-plugin-n from 17.24.0 to 18.0.1 in the npm group

  See <https://github.com/eslint-community/eslint-plugin-n/releases>

## 11.2.0

### Minor Changes

- 61d1577: 更新 eslint-plugin-promise 到 7.3.0 版本，我们不再需要覆盖该依赖对 eslint 10.0.0 的 peerDependency 要求了。

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
