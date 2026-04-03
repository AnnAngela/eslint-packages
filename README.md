# AnnAngela 的 ESLint Packages

[![npm publish](https://github.com/AnnAngela/eslint-packages/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/AnnAngela/eslint-packages/actions/workflows/npm-publish.yml)
[![CodeQL](https://github.com/AnnAngela/eslint-packages/actions/workflows/CodeQL.yaml/badge.svg)](https://github.com/AnnAngela/eslint-packages/actions/workflows/CodeQL.yaml)
[![Linter](https://github.com/AnnAngela/eslint-packages/actions/workflows/linter.yaml/badge.svg)](https://github.com/AnnAngela/eslint-packages/actions/workflows/linter.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

这是一个围绕 ESLint 生态维护的多包仓库，提供共享配置、插件与 GitHub Actions Formatter，用于提升代码质量与维护体验。

## 📦 包列表

本仓库当前包含以下可发布包：

### [@annangela/eslint-config](packages/eslint-config)

[![npm version](https://img.shields.io/npm/v/@annangela/eslint-config.svg)](https://www.npmjs.com/package/@annangela/eslint-config)

面向 AnnAngela 项目的 ESLint 配置包，支持当前维护中的 Node.js LTS 版本，包含以下配置：

- 基础 JavaScript 配置
- 浏览器环境配置
- Node.js 环境配置
- TypeScript 配置
- ESLint 插件开发配置
- Mocha 测试配置

**安装：**

```bash
npm install --save-dev @annangela/eslint-config
```

[查看包文档 →](packages/eslint-config/README.md)

### [@annangela/eslint-formatter-gha](packages/eslint-formatter-gha)

[![npm version](https://img.shields.io/npm/v/@annangela/eslint-formatter-gha.svg)](https://www.npmjs.com/package/@annangela/eslint-formatter-gha)

这是一个专为 GitHub Actions 设计的 ESLint Formatter，可输出更易读的注解与摘要信息，支持：

- 更清晰的错误展示
- 可配置的废弃规则等级
- GitHub Actions 注解输出
- 工作流摘要展示

**安装：**

```bash
npm install --save-dev @annangela/eslint-formatter-gha
```

**使用：**

```bash
npx eslint -f @annangela/eslint-formatter-gha src
```

[查看包文档 →](packages/eslint-formatter-gha/README.md)

### [@annangela/eslint-plugin-prefer-reflect](packages/eslint-plugin-prefer-reflect)

[![npm version](https://img.shields.io/npm/v/@annangela/eslint-plugin-prefer-reflect.svg)](https://www.npmjs.com/package/@annangela/eslint-plugin-prefer-reflect)

这是对 ESLint 原始 `prefer-reflect` 思路的现代化实现，鼓励优先使用 Reflect API，而不是旧的 Object / Function 写法。

**安装：**

```bash
npm install --save-dev @annangela/eslint-plugin-prefer-reflect
```

**使用：**

```javascript
import preferReflectPlugin from "@annangela/eslint-plugin-prefer-reflect";

export default {
    plugins: {
        "@annangela/prefer-reflect": preferReflectPlugin,
    },
    rules: {
        "@annangela/prefer-reflect/prefer-reflect": "error",
    },
};
```

[查看包文档 →](packages/eslint-plugin-prefer-reflect/README.md)

## 🚀 快速开始

### 环境要求

- Node.js：当前 LTS 版本（2026 年 4 月：`^20.19 || ^22.21 || ^24.11`）
- npm（随 Node.js 一起提供）

### 使用这些包

可按需单独安装任意包：

```bash
# ESLint 配置
npm install --save-dev @annangela/eslint-config

# GitHub Actions Formatter
npm install --save-dev @annangela/eslint-formatter-gha

# prefer-reflect 插件
npm install --save-dev @annangela/eslint-plugin-prefer-reflect
```

更详细的使用说明请查看各个包目录下的 README。

## 🛠️ 开发

仓库级开发、维护、发布与 CI 说明请查看 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 快速初始化

```bash
git clone https://github.com/AnnAngela/eslint-packages.git
cd eslint-packages
npm install
```

### 常用命令

```bash
# 运行完整校验流程
npm run verify

# 重新同步派生 package.json 元数据
npm run sync:packages

# 为影响已发布包的改动编写 changeset
npm run changeset
```

### 针对单个 workspace 的命令

```bash
# 将 <package-name> 替换为 eslint-config、eslint-formatter-gha 或 eslint-plugin-prefer-reflect
npm run build --workspace=@annangela/<package-name>
npm run lint --workspace=@annangela/<package-name>
npm run test --workspace=@annangela/<package-name>
```

## 📚 文档

- **[贡献指南](CONTRIBUTING.md)** - 仓库架构、workspace、脚本、Changesets、发布与 CI 说明
- **[行为准则](CODE_OF_CONDUCT.md)** - 社区参与规范
- **[安全策略](SECURITY.md)** - 安全漏洞报告方式与处理说明

包级使用文档请查看各包目录下的 README。

## 🤝 参与贡献

欢迎贡献。提交前请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，并遵守 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。

## 📄 许可

本项目基于 MIT 许可协议发布；各包目录中也包含对应的许可信息。

## 🔗 链接

- **GitHub 仓库**：<https://github.com/AnnAngela/eslint-packages>
- **Issue Tracker**：<https://github.com/AnnAngela/eslint-packages/issues>
- **npm 组织**：[@annangela](https://www.npmjs.com/~annangela)

## 👤 作者

- **AnnAngela**
  - GitHub: [@AnnAngela](https://github.com/AnnAngela)

## ⭐ 支持

如果这些包对你有帮助，欢迎为仓库点一个 Star。

---

> 为更好的 ESLint 配置与维护体验而生 ❤️
