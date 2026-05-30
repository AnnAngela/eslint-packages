---
"@annangela/eslint-plugin-prefer-reflect": patch
"@annangela/eslint-config": patch
"@annangela/eslint-formatter-gha": patch
---

docs: 优化所有包的文档，修复准确性问题并补充内容

- 修复 prefer-reflect 规则文档中 `Reflect.getPrototypeOf` 示例参数错误（该方法只接受 1 个参数）
- 修复 prefer-reflect 规则文档中 `deleteProperty` 的 exceptions 配置示例使用了错误的 key
- 统一 prefer-reflect 规则文档中的 ECMAScript 规范链接为 tc39.es 最新草案
- 为 prefer-reflect 规则文档中每个 Reflect 方法补充实际场景示例
- 为 eslint-config README 补充安装说明和 Flat Config 使用示例
- 优化 eslint-formatter-gha README 的截图描述文字和默认值表格
- 统一所有包的 Shell 代码块标记为 `bash`，安装命令风格为 `npm install`
