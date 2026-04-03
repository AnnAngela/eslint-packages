# @annangela/eslint-config

这是 AnnAngela 项目使用的 ESLint 配置包，支持当前维护中的 Node.js LTS 版本。

## 导出内容

该包同时提供命名导出与默认导出，主要包含两个导出对象：

- `configs`
  - 包含以下配置（见 [`src/configs`](src/configs)）：
    - `base`：适用于所有 JavaScript 文件的基础配置
    - `browser`：浏览器环境附加配置
    - `node`：Node.js 环境附加配置
    - `typescript`：TypeScript 项目附加配置
    - `eslintPlugin`：用于 ESLint 插件开发的附加配置
    - `mocha`：用于 Mocha 测试文件的附加配置
- `forkedGlobals`
  - 包含从 [globals](https://github.com/sindresorhus/globals/blob/v15.14.0/globals.json) 衍生而来的全局变量集合（见 [`src/forkedGlobals.js`](src/forkedGlobals.js)）：
    - `jquery`
    - `greasemonkey`
    - `mocha`

## 额外导出文件

该包还额外导出以下 tsconfig 文件：

- [`./tsconfig.browser.json`](src/tsconfigs/tsconfig.browser.json)
- [`./tsconfig.node20.json`](src/tsconfigs/tsconfig.node20.json)
- [`./tsconfig.node20.cjs.json`](src/tsconfigs/tsconfig.node20.cjs.json)
- [`./tsconfig.node22.json`](src/tsconfigs/tsconfig.node22.json)
- [`./tsconfig.node22.cjs.json`](src/tsconfigs/tsconfig.node22.cjs.json)
- [`./tsconfig.node24.json`](src/tsconfigs/tsconfig.node24.json)
- [`./tsconfig.node24.cjs.json`](src/tsconfigs/tsconfig.node24.cjs.json)
