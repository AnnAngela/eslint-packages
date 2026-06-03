---
"@annangela/eslint-plugin-prefer-reflect": minor
---

feat(prefer-reflect): 添加自动修复与 suggestions 支持，完善边界情况处理

### 自动修复（`eslint --fix`）
- 为规则启用 `meta.fixable: "code"`，支持自动修复
- 支持以下写法的自动转换：
  - `Function.prototype.apply` → `Reflect.apply`（含参数重组）
  - `Function.prototype.call` → `Reflect.apply`（含参数重组）
  - `Object.defineProperty` → `Reflect.defineProperty`
  - `Object.getOwnPropertyDescriptor` → `Reflect.getOwnPropertyDescriptor`
  - `Object.getPrototypeOf` → `Reflect.getPrototypeOf`
  - `Object.isExtensible` → `Reflect.isExtensible`
  - `Object.preventExtensions` → `Reflect.preventExtensions`
  - `Object.setPrototypeOf` → `Reflect.setPrototypeOf`
  - `delete` → `Reflect.deleteProperty`
  - `in` → `Reflect.has`

### Suggestion 降级（语义安全）
部分场景因静态无法保证语义等价，降级为 suggestion（需用户手动确认）：
- `func.apply(...spread)` / `func.call(...spread)`：spread 在运行时可能提供不足参数导致 `Reflect.apply` 抛出 TypeError
- `Object.getOwnPropertyNames()` → `Reflect.ownKeys`：后者额外返回 Symbol 键，语义不等价
- `delete` 非成员表达式（如 `delete foo()`、`delete (a, b)`）：无直接 `Reflect.deleteProperty` 等价写法，建议移除 `delete` 关键字
- `func.apply(thisArg, ...rest)` 中 argsList 为 spread 时：无法静态保证 argumentsList

### Bug 修复
- 修复 `func.apply(thisArg, ...rest)` suggestion 错误生成 `...rest, []` 的问题，改为直接传递 `rest` 作为 argumentsList
- 添加 scope 分析检测 `Object` 变量遮蔽（如 `const Object = {}`），防止被遮蔽时误报
- 修复 SequenceExpression 在 call/apply/delete/in 各位置时内部逗号泄漏到外层参数分隔的问题

### 其他
- 重命名 `preferReflectCallSpreadSuggest` messageId 为 `preferReflectSpreadSuggest`，反映其在 apply 和 call 分支中均被使用
- `delete` 非计算属性名改用 `JSON.stringify` 生成以确保健壮性
- 补充 CallExpression visitor 架构注释和 delete suggestion 语义说明
