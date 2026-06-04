---
"@annangela/eslint-config": patch
"@annangela/eslint-formatter-gha": minor
"@annangela/eslint-plugin-prefer-reflect": patch
---

**代码质量优化：移除冗余规则、新增 API 别名与文档增强**

- **`@annangela/eslint-config` (patch)**：移除 `node` 配置中 3 条冗余的 `n/no-unsupported-features/*` 规则（`eslint-plugin-n` 的 `flat/recommended-module` 配置已自带这些规则，且默认支持从 `engines.node` 自动检测版本）
- **`@annangela/eslint-formatter-gha` (minor)**：
  - 新增 `addSeparator()` 方法作为拼写正确的公开 API，原有 `addSeperator()` 标记为 deprecated
  - `ActionsSummary.wrap()` 方法中的 HTML 属性值现已进行实体转义（`&`、`"`、`<`、`>`）
- **`@annangela/eslint-plugin-prefer-reflect` (patch)**：
  - 在中英文文档中增加了 `Object.getOwnPropertyNames` → `Reflect.ownKeys` 替换的语义差异警告（Symbol 键）
  - 提取 `EXCEPTION_NAMES` 共享常量，减少 schema 与方法名映射之间的重复

---

**Code quality improvements: redundant rules removal, new API alias, and documentation enhancement**

- **`@annangela/eslint-config` (patch)**: Removed 3 redundant `n/no-unsupported-features/*` rules from `node` config — `eslint-plugin-n`'s `flat/recommended-module` already includes them with auto-detection from `engines.node`
- **`@annangela/eslint-formatter-gha` (minor)**:
  - Added `addSeparator()` as the correctly spelled public API; `addSeperator()` is now deprecated
  - HTML attribute values in `ActionsSummary.wrap()` are now entity-escaped (`&`, `"`, `<`, `>`)
- **`@annangela/eslint-plugin-prefer-reflect` (patch)**:
  - Added semantic difference warning for `Object.getOwnPropertyNames` → `Reflect.ownKeys` in both Chinese and English documentation
  - Extracted `EXCEPTION_NAMES` shared constant to reduce duplication across schema and method name mappings
