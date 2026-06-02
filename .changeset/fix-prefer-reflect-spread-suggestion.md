---
"@annangela/eslint-plugin-prefer-reflect": patch
---

fix(prefer-reflect): correct spread argsList suggestion and detect Object shadowing

- 修复 `func.apply(thisArg, ...rest)` 的 suggestion 错误生成 `Reflect.apply(func, thisArg, ...rest, [])` 的问题，改为正确传递 `rest` 作为 argumentsList（`Reflect.apply(func, thisArg, rest)`）
- 重命名 `preferReflectCallSpreadSuggest` 为 `preferReflectSpreadSuggest`，反映其同时在 apply 和 call 分支中使用
- 添加 scope 分析检测 `Object` 变量遮蔽（如 `const Object = {}`），防止被遮蔽时误报
- 补充 CallExpression visitor 架构注释和 delete 非成员 suggestion 语义说明
