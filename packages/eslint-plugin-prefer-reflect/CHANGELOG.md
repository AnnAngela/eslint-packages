# @annangela/eslint-plugin-prefer-reflect

## 6.1.0

### Minor Changes

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

- 58efb89: **prefer-reflect 规则增强：自动修复、建议与边界情况完善**

  - **自动修复支持**：启用 `meta.fixable: "code"`，`eslint --fix` 可自动将以下写法转换为 `Reflect` 等价写法：
    - `Function.prototype.apply` / `Function.prototype.call` → `Reflect.apply`（含参数重组）
    - `Object.defineProperty` / `Object.getOwnPropertyDescriptor` / `Object.getPrototypeOf` / `Object.isExtensible` / `Object.preventExtensions` / `Object.setPrototypeOf` → 对应的 `Reflect.*`
    - `delete obj.prop` → `Reflect.deleteProperty(obj, "prop")`
    - `"prop" in obj` → `Reflect.has(obj, "prop")`
  - **语义安全的建议降级**：以下场景因静态无法保证语义等价，降级为 suggestion（需用户手动确认）：
    - `func.apply(...spread)` / `func.call(...spread)`：spread 在运行时可能提供不足参数导致 `Reflect.apply` 抛出 TypeError
    - `Object.getOwnPropertyNames()` → `Reflect.ownKeys`：后者额外返回 Symbol 键，语义不等价
    - `delete` 非成员表达式（如 `delete foo()`、`delete (a, b)`）：无直接 `Reflect.deleteProperty` 等价写法，建议移除 `delete` 关键字
    - `func.apply(thisArg, ...rest)` 中 argsList 为 spread：无法静态保证 argumentsList
  - **Bug 修复**：
    - 修复 `func.apply(thisArg, ...rest)` 的 suggestion 错误生成 `...rest, []` 的问题，改为直接传递 `rest` 作为 argumentsList
    - 添加 scope 分析检测 `Object` 变量遮蔽（如 `const Object = {}`），防止被遮蔽时误报
    - 修复 SequenceExpression 在 call/apply/delete/in 各位置时逗号泄漏到外层参数分隔的问题
    - 修复规则文档中 `exceptions` 示例使用了错误的 `"delete"` key（应为 `"deleteProperty"`）
  - **其他改进**：
    - `delete` 非计算属性名改用 `JSON.stringify` 生成以确保健壮性
    - 重命名 `preferReflectCallSpreadSuggest` messageId 为 `preferReflectSpreadSuggest`
    - 规则文档新增各 Reflect 方法的实际场景示例，修正 `Reflect.getPrototypeOf` 示例参数错误，统一 ECMAScript 规范链接为 tc39.es 最新草案

  ***

  **prefer-reflect rule enhancement: auto-fix, suggestions, and edge-case refinements**

  - **Auto-fix support**: Enabled `meta.fixable: "code"`, allowing `eslint --fix` to automatically convert the following to their `Reflect` equivalents:
    - `Function.prototype.apply` / `Function.prototype.call` → `Reflect.apply` (with argument restructuring)
    - `Object.defineProperty` / `Object.getOwnPropertyDescriptor` / `Object.getPrototypeOf` / `Object.isExtensible` / `Object.preventExtensions` / `Object.setPrototypeOf` → corresponding `Reflect.*`
    - `delete obj.prop` → `Reflect.deleteProperty(obj, "prop")`
    - `"prop" in obj` → `Reflect.has(obj, "prop")`
  - **Semantically-safe suggestion downgrades**: The following cases are downgraded to suggestions (requiring manual confirmation) because semantic equivalence cannot be statically guaranteed:
    - `func.apply(...spread)` / `func.call(...spread)`: the spread may provide insufficient arguments at runtime, causing `Reflect.apply` to throw a TypeError
    - `Object.getOwnPropertyNames()` → `Reflect.ownKeys`: the latter additionally returns Symbol keys, making it semantically inequivalent
    - `delete` on non-member expressions (e.g. `delete foo()`, `delete (a, b)`): no direct `Reflect.deleteProperty` equivalent exists; suggests removing the `delete` keyword
    - `func.apply(thisArg, ...rest)` with spread at argsList position: the argumentsList cannot be statically guaranteed
  - **Bug fixes**:
    - Fixed the suggestion for `func.apply(thisArg, ...rest)` incorrectly generating `...rest, []`; now passes `rest` directly as the argumentsList
    - Added scope analysis to detect `Object` variable shadowing (e.g. `const Object = {}`), preventing false positives when `Object` has been shadowed
    - Fixed SequenceExpression comma leaking into outer argument-separator positions in call/apply/delete/in contexts
    - Fixed the rule documentation using the wrong `"delete"` key in exceptions examples (should be `"deleteProperty"`)
  - **Other improvements**:
    - `delete` with non-computed property names now uses `JSON.stringify` for robustness
    - Renamed `preferReflectCallSpreadSuggest` messageId to `preferReflectSpreadSuggest`
    - Rule documentation: added practical examples for each Reflect method, fixed incorrect parameter count in `Reflect.getPrototypeOf` examples, unified ECMAScript specification links to the latest tc39.es drafts

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

## 6.0.0

### Major Changes

- ce382b2: 移除了对 Node.js 20 的支持，所有包现在仅支持 Node.js 22 和 Node.js 24。

  `@annangela/eslint-config` 同时移除了 `./tsconfig.node20.json` 与 `./tsconfig.node20.cjs.json` 导出。
