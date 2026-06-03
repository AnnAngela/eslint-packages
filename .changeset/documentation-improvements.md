---
"@annangela/eslint-plugin-prefer-reflect": patch
"@annangela/eslint-config": patch
"@annangela/eslint-formatter-gha": patch
---

### 中文

**文档与注释完善**

- **`@annangela/eslint-plugin-prefer-reflect`**：
  - 规则文档新增各 Reflect 方法的实际场景示例
  - 修正 `Reflect.getPrototypeOf` 示例参数错误（该方法仅接受 1 个参数）
  - 统一 ECMAScript 规范链接为 tc39.es 最新草案
  - 修正 `exceptions` 配置示例中 `"delete"` → `"deleteProperty"` 的错误 key
  - 补充 `delete` 非成员 suggestion 的语义取舍说明
  - 补充 `CallExpression` visitor 架构注释，说明四个分支不可合并的设计决策
- **`@annangela/eslint-config`**：
  - README 补充安装说明和 Flat Config 使用示例
  - 修正 `forkedGlobals.js` 中 `false`/`true` 值的含义说明
- **`@annangela/eslint-formatter-gha`**：
  - README 优化截图描述文字和默认值表格
- **通用**：
  - `CONTRIBUTING.md` 修正已删除的 `test` 命令残留引用，精确描述 `verify` 与 `verify:ci` 的差异
  - 所有 Shell 代码块统一为 `bash` 标记

---

### English

**Documentation and comment improvements**

- **`@annangela/eslint-plugin-prefer-reflect`**:
  - Added practical examples for each Reflect method in the rule documentation
  - Fixed incorrect parameter count in `Reflect.getPrototypeOf` examples (the method accepts only 1 argument)
  - Unified ECMAScript specification links to the latest tc39.es drafts
  - Fixed wrong `"delete"` key to `"deleteProperty"` in exceptions configuration examples
  - Added documentation explaining the semantic trade-off of the `delete` non-member suggestion
  - Added architecture comments for the `CallExpression` visitor, explaining why the four branches are intentionally kept separate
- **`@annangela/eslint-config`**:
  - Added installation instructions and Flat Config usage examples to the README
  - Documented the meaning of `false`/`true` values in `forkedGlobals.js`
- **`@annangela/eslint-formatter-gha`**:
  - Improved README screenshot descriptions and defaults table
- **General**:
  - `CONTRIBUTING.md`: fixed stale `test` command reference, clarified the difference between `verify` and `verify:ci`
  - Unified all Shell code blocks to use the `bash` language tag
