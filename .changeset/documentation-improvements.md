---
"@annangela/eslint-plugin-prefer-reflect": patch
"@annangela/eslint-config": patch
"@annangela/eslint-formatter-gha": patch
---

**文档与注释完善**

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

---

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
