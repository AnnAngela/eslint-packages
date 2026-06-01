---
"@annangela/eslint-plugin-prefer-reflect": patch
---

fix: 消除 prefer-reflect 规则自动修复中的 `return null` 路径，增加 suggestion 支持

- 移除 apply/call 分支中因展开参数导致 fixer 返回 null 的问题
  - `func.apply(thisArg, ...rest)` → `Reflect.apply(func, thisArg, ...rest)`
  - `func.call(thisArg, head, ...rest)` → `Reflect.apply(func, thisArg, [head, ...rest])`
- 移除 delete 非成员表达式（如 `delete foo()`）的 null fixer，改为 suggestion 建议移除 delete 关键字
- 修复 SequenceExpression 在 call/apply/delete/in 各位置时内部逗号泄漏到外层参数分隔的问题（PR #362 review feedback）
- 为 `func.call(...simpleIdent)` 提供可真实应用的 suggestion：`Reflect.apply(func, ident[0], ident.slice(1))`
- 启用 `hasSuggestions` 元数据，使规则支持 ESLint suggestion 机制
