# @annangela/eslint-formatter-gha

## 6.1.0

### Minor Changes

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

- 58efb89: **formatter 测试框架迁移：mocha → vitest 与 smoke test**

  - 将 `@annangela/eslint-formatter-gha` 的测试框架从 mocha 迁移至 vitest，新增覆盖率支持
  - 新增 `tests/` 目录下的 smoke test，验证 formatter 在真实 ESLint 调用链中的行为
  - 优化 `ActionsSummary` 的属性处理和环境变量访问模式

  ***

  **Formatter test framework migration: mocha → vitest with smoke tests**

  - Migrated `@annangela/eslint-formatter-gha`'s test framework from mocha to vitest, with coverage support
  - Added smoke tests in the `tests/` directory, validating formatter behavior in a real ESLint invocation chain
  - Improved `ActionsSummary` attribute handling and environment variable access patterns

## 6.0.0

### Major Changes

- ce382b2: 移除了对 Node.js 20 的支持，所有包现在仅支持 Node.js 22 和 Node.js 24。

  `@annangela/eslint-config` 同时移除了 `./tsconfig.node20.json` 与 `./tsconfig.node20.cjs.json` 导出。
