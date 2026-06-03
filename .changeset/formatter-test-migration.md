---
"@annangela/eslint-formatter-gha": patch
---

**formatter 测试框架迁移：mocha → vitest 与 smoke test**

- 将 `@annangela/eslint-formatter-gha` 的测试框架从 mocha 迁移至 vitest，新增覆盖率支持
- 新增 `tests/` 目录下的 smoke test，验证 formatter 在真实 ESLint 调用链中的行为
- 优化 `ActionsSummary` 的属性处理和环境变量访问模式

---

**Formatter test framework migration: mocha → vitest with smoke tests**

- Migrated `@annangela/eslint-formatter-gha`'s test framework from mocha to vitest, with coverage support
- Added smoke tests in the `tests/` directory, validating formatter behavior in a real ESLint invocation chain
- Improved `ActionsSummary` attribute handling and environment variable access patterns
