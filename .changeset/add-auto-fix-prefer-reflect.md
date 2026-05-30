---
"@annangela/eslint-plugin-prefer-reflect": minor
---

feat: 为 prefer-reflect 规则添加自动修复功能

- 设置 `meta.fixable: "code"` 使规则支持 `eslint --fix` 自动修复
- 支持 11 种旧写法的自动转换：Object.defineProperty → Reflect.defineProperty、Object.getOwnPropertyDescriptor → Reflect.getOwnPropertyDescriptor、Object.getPrototypeOf → Reflect.getPrototypeOf、Object.setPrototypeOf → Reflect.setPrototypeOf、Object.isExtensible → Reflect.isExtensible、Object.preventExtensions → Reflect.preventExtensions、Object.getOwnPropertyNames → Reflect.ownKeys、Function.prototype.apply → Reflect.apply、Function.prototype.call → Reflect.apply、delete → Reflect.deleteProperty、in → Reflect.has
