---
"@annangela/eslint-config": major
"@annangela/eslint-formatter-gha": minor
"@annangela/eslint-plugin-prefer-reflect": minor
---

**ESLint v10 适配：升级 @eslint/js 与添加 peerDependencies**

- **`@annangela/eslint-config` (major)**：升级 `@eslint/js` 从 v9.39.4 到 v10.0.1，引入 3 个新推荐规则：
  - `no-unassigned-vars`：禁止声明后从未赋值的变量
  - `no-useless-assignment`：禁止无效的赋值操作
  - `preserve-caught-error`：强制在 `catch` 子句中引用错误对象
  - 恢复 `@eslint/js/recommended` 配置的 `name` 属性
  - 新增 `engines.node: ^20.19.0 || ^22.13.0 || >=24`
- **`@annangela/eslint-formatter-gha` (minor)**：新增 `peerDependencies.eslint: ^10.0.0`，遵循 ESLint 官方插件开发规范，明确与宿主工具的兼容范围
- **`@annangela/eslint-plugin-prefer-reflect` (minor)**：新增 `peerDependencies.eslint: ^10.0.0`，同上

---

**ESLint v10 support: @eslint/js upgrade and peerDependencies**

- **`@annangela/eslint-config` (major)**: Upgraded `@eslint/js` from v9.39.4 to v10.0.1, introducing 3 new recommended rules:
  - `no-unassigned-vars`: disallows variables that are declared but never assigned
  - `no-useless-assignment`: disallows assignments that have no effect
  - `preserve-caught-error`: enforces referencing the error object in `catch` clauses
  - Restored the `name` property on the `@eslint/js/recommended` config
  - Added `engines.node: ^20.19.0 || ^22.13.0 || >=24`
- **`@annangela/eslint-formatter-gha` (minor)**: Added `peerDependencies.eslint: ^10.0.0`, following ESLint's official plugin development guidelines to express compatibility with the host tool
- **`@annangela/eslint-plugin-prefer-reflect` (minor)**: Added `peerDependencies.eslint: ^10.0.0`, same as above
