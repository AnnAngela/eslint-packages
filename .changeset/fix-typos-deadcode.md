---
"@annangela/eslint-config": patch
"@annangela/eslint-formatter-gha": patch
"@annangela/eslint-plugin-prefer-reflect": patch
---

**修正拼写错误、死代码与构建产物**

- **`@annangela/eslint-config` (patch)**：
  - 修正 `browser` 配置中 `parserOptions.sourceType` 不一致的问题，统一为 `"script"` 模式
  - 注释掉 `typescript` 配置中无效的 `eslint-recommended` 规则展开（eslintrc 格式使用 `overrides` 而非 `rules`，该展开为空操作）
- **`@annangela/eslint-formatter-gha` (patch)**：修正已弃用规则严重级别警告消息中的多余 "it" 语法错误
- **`@annangela/eslint-plugin-prefer-reflect` (patch)**：修正 schema 中 `exceptions` 属性的拼写错误（"Execptions" → "Exceptions"）

---

**Fix typos, dead code, and build artifacts**

- **`@annangela/eslint-config` (patch)**:
  - Fixed inconsistent `parserOptions.sourceType` in `browser` config — now unified to `"script"`
  - Commented out dead `eslint-recommended` config spread in `typescript` config (eslintrc format uses `overrides`, not `rules` — the spread was a no-op)
- **`@annangela/eslint-formatter-gha` (patch)**: Fixed extra "it" in the deprecated rules severity warning message
- **`@annangela/eslint-plugin-prefer-reflect` (patch)**: Fixed schema typo in `exceptions` property description ("Execptions" → "Exceptions")
