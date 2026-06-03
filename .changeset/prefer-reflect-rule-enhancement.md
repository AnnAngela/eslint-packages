---
"@annangela/eslint-plugin-prefer-reflect": minor
---

### 中文

**prefer-reflect 规则增强：自动修复、建议与边界情况完善**

- **自动修复支持**：启用 `meta.fixable: "code"`，`eslint --fix` 可自动将以下写法转换为 `Reflect` 等价写法：
  - `Function.prototype.apply` / `Function.prototype.call` → `Reflect.apply`（含参数重组）
  - `Object.defineProperty` / `Object.getOwnPropertyDescriptor` / `Object.getPrototypeOf` / `Object.isExtensible` / `Object.preventExtensions` / `Object.setPrototypeOf` → 对应的 `Reflect.*`
  - `delete obj.prop` → `Reflect.deleteProperty(obj, "prop")`
  - `"prop" in obj` → `Reflect.has(obj, "prop")`
- **语义安全的建议降级**：以下场景因静态无法保证语义等价，降级为 suggestion（需用户手动确认）：
  - `func.apply(...spread)` / `func.call(...spread)`：spread 在运行时可能提供不足参数导致 `Reflect.apply` 抛出 TypeError
  - `Object.getOwnPropertyNames()` → `Reflect.ownKeys`：后者额外返回 Symbol 键，语义不等价
  - `delete` 非成员表达式（如 `delete foo()`）：无直接 `Reflect.deleteProperty` 等价写法
- **Bug 修复**：
  - 修复 `func.apply(thisArg, ...rest)` 的 suggestion 错误生成 `...rest, []` 的问题，改为直接传递 `rest` 作为 argumentsList
  - 添加 scope 分析检测 `Object` 变量遮蔽（如 `const Object = {}`），防止被遮蔽时误报
  - 修复 SequenceExpression 在 call/apply/delete/in 各位置时逗号泄漏到外层参数分隔的问题
  - 修复规则文档中 `exceptions` 示例使用了错误的 `"delete"` key（应为 `"deleteProperty"`）
- **其他**：重命名 `preferReflectCallSpreadSuggest` messageId 为 `preferReflectSpreadSuggest`

---

### English

**prefer-reflect rule enhancement: auto-fix, suggestions, and edge-case refinements**

- **Auto-fix support**: Enabled `meta.fixable: "code"`, allowing `eslint --fix` to automatically convert the following to their `Reflect` equivalents:
  - `Function.prototype.apply` / `Function.prototype.call` → `Reflect.apply` (with argument restructuring)
  - `Object.defineProperty` / `Object.getOwnPropertyDescriptor` / `Object.getPrototypeOf` / `Object.isExtensible` / `Object.preventExtensions` / `Object.setPrototypeOf` → corresponding `Reflect.*`
  - `delete obj.prop` → `Reflect.deleteProperty(obj, "prop")`
  - `"prop" in obj` → `Reflect.has(obj, "prop")`
- **Semantically-safe suggestion downgrades**: The following cases are downgraded to suggestions (requiring manual confirmation) because semantic equivalence cannot be statically guaranteed:
  - `func.apply(...spread)` / `func.call(...spread)`: the spread may provide insufficient arguments at runtime, causing `Reflect.apply` to throw a TypeError
  - `Object.getOwnPropertyNames()` → `Reflect.ownKeys`: the latter additionally returns Symbol keys, making it semantically inequivalent
  - `delete` on non-member expressions (e.g. `delete foo()`): no direct `Reflect.deleteProperty` equivalent exists
- **Bug fixes**:
  - Fixed the suggestion for `func.apply(thisArg, ...rest)` incorrectly generating `...rest, []`; now passes `rest` directly as the argumentsList
  - Added scope analysis to detect `Object` variable shadowing (e.g. `const Object = {}`), preventing false positives when `Object` has been shadowed
  - Fixed SequenceExpression comma leaking into outer argument-separator positions in call/apply/delete/in contexts
  - Fixed the rule documentation using the wrong `"delete"` key in exceptions examples (should be `"deleteProperty"`)
- **Other**: Renamed `preferReflectCallSpreadSuggest` messageId to `preferReflectSpreadSuggest`
