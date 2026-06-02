---
"@annangela/eslint-plugin-prefer-reflect": patch
---

fix(prefer-reflect): 修复 auto-fix 语义不等价问题，确保 `eslint --fix` 不静默改变程序行为

- `func.apply(...spread)` 从 auto-fix 降级为 suggestion：`Reflect.apply` 严格要求 3 个参数，而 `Function.prototype.apply` 允许省略参数，spread 在运行时可能提供少于 2 个元素导致修复后抛出 TypeError
- `Object.getOwnPropertyNames()` 从 auto-fix 降级为 suggestion：`Reflect.ownKeys` 额外返回 Symbol 键，与 `getOwnPropertyNames`（仅返回字符串键）语义不等价
- `delete` 非计算属性名生成改用 `JSON.stringify` 替代字符串拼接以增强健壮性
- 移除内部 `report` 辅助函数，全部内联为 `context.report()` 调用，使 `eslint-plugin/prefer-message-ids` 等 lint 规则能够正确检查所有报告路径
- `delete` 非成员表达式 suggestion 改用 `messageId` + `data` 模式，去除裸 `desc` 字段
