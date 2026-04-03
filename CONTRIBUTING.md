# 贡献与维护指南

感谢你参与 `AnnAngela/eslint-packages` 的维护与贡献。

本文档面向仓库维护者与贡献者，说明仓库架构、workspace 使用方式、脚本职责、Changesets 工作流、发布流程、CI 校验方式，以及日常维护时需要注意的事项。

## 1. 环境要求

- Node.js：当前 LTS 版本（2026 年 4 月：`^20.19 || ^22.21 || ^24.11`）
- npm：使用与受支持 Node.js 版本配套的 npm 即可
- 命令执行目录：除非特别说明，仓库级命令都应在仓库根目录执行

建议在开始修改前先确认：

```bash
node -v
npm -v
```

## 2. 仓库架构概览

本仓库是一个基于 npm workspaces 的 monorepo，根目录统一管理依赖、脚本、CI 与发布流程，`packages/*` 下维护实际发布到 npm 的包。

### 2.1 顶层目录职责

- `packages/`
  - 存放所有可发布包
- `.changeset/`
  - 存放 changeset 文件与 Changesets 配置
- `.github/workflows/`
  - 存放 CI、发布与安全扫描工作流
- `scripts/`
  - 存放仓库级辅助脚本，例如元数据同步、CI 前后处理、测试脚本等
- `package.json`
  - 根工作区配置、统一依赖、统一脚本入口
- `package-lock.json`
  - 根锁文件，workspace 共享安装结果

### 2.2 各 workspace 的职责

#### `packages/eslint-config`

提供共享 ESLint 配置与 tsconfig 导出文件，是面向使用者的配置包。

#### `packages/eslint-formatter-gha`

提供专门面向 GitHub Actions 的 ESLint formatter，也是仓库 CI 中 lint 输出的重要组成部分。

#### `packages/eslint-plugin-prefer-reflect`

提供 `@annangela/prefer-reflect/prefer-reflect` 规则，是一个独立发布的 ESLint 插件包。

## 3. npm workspaces 用法

### 3.1 根工作区配置

根 `package.json` 中声明了：

```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

这意味着：

- 安装依赖时由根目录统一解析并写入 `package-lock.json`
- 根目录可通过 `--workspace` / `--workspaces` 调用各包脚本
- 多个包之间的开发流程通过统一脚本协调，而不是分别进入子目录手动执行

### 3.2 常见 workspace 命令

在根目录执行：

```bash
# 对单个 workspace 执行构建
npm run build --workspace=@annangela/eslint-config

# 对单个 workspace 执行 lint
npm run lint --workspace=@annangela/eslint-formatter-gha

# 对单个 workspace 执行测试
npm run test --workspace=@annangela/eslint-plugin-prefer-reflect

# 对所有 workspace 执行同名脚本
npm run test --workspaces
```

### 3.3 什么时候用单包命令，什么时候用根命令

- **只在某个包内迭代时**：优先使用 `--workspace` 命令，反馈更快
- **准备提交前**：使用根级 `npm run verify`
- **改动影响多个包、脚本或发布流程时**：直接使用根级命令验证整个仓库

## 4. 初始化与日常开发

### 4.1 首次初始化

```bash
git clone https://github.com/AnnAngela/eslint-packages.git
cd eslint-packages
npm install
```

`npm install` 会安装根依赖与所有 workspace 依赖，不需要逐个包单独安装。

### 4.2 推荐的本地工作流

适用于大多数代码、配置或文档修改：

1. 修改代码或文档
2. 如涉及根依赖、包依赖或包级元数据，执行 `npm run sync:packages`
3. 如改动影响已发布包的用户可见行为，执行 `npm run changeset`
4. 执行 `npm run verify`
5. 确认结果无误后再提交

### 4.3 增量调试建议

如果只是在开发某个包，可以先运行更小粒度的命令：

```bash
npm run build --workspace=@annangela/eslint-plugin-prefer-reflect
npm run lint --workspace=@annangela/eslint-plugin-prefer-reflect
npm run test --workspace=@annangela/eslint-plugin-prefer-reflect
```

完成局部验证后，仍然应补跑一次：

```bash
npm run verify
```

## 5. 根脚本详解

以下命令均定义在根 `package.json` 中，是维护仓库时最常用的入口。

| 命令 | 作用 | 适用场景 |
| --- | --- | --- |
| `npm run changeset` | 交互式生成 changeset 文件 | 有用户可见改动需要进入版本与 changelog 时 |
| `npm run version` | 应用所有待发布 changeset | 本地预览版本变更，或由发布流程自动调用 |
| `npm run release` | 构建并发布尚未发布的版本 | 主要由发布工作流调用 |
| `npm run build` | 构建所有 workspace | 本地或 CI 统一构建 |
| `npm run lint` | 本地 lint 校验 | 本地检查代码质量 |
| `npm run lint:ci` | CI 风格 lint 校验 | 需要验证 GitHub Actions formatter 输出时 |
| `npm run lint:ci:run` | 在前置构建已完成后执行 lint 主体 | 避免重复执行检查或构建 |
| `npm run test` | 运行全部 workspace 测试 | 常规测试入口 |
| `npm run verify` | 运行完整校验流程 | 提交前、CI、发布前 |
| `npm run sync:packages` | 回写派生 package.json 字段 | 根依赖或包元数据变更后 |
| `npm run check:packages` | 检查包元数据是否漂移 | CI 或提交前只读校验 |
| `npm run verify:packages` | `check:packages` 的别名 | 命名统一 |
| `npm run lint:check` | `lint` 的兼容别名 | 兼容旧调用方式 |
| `npm run lint:check-ci` | `lint:ci` 的兼容别名 | 兼容旧调用方式 |
| `npm run lint:write` | 在根目录执行 ESLint 自动修复 | 修复可自动处理的问题 |
| `npm run ci` | 检测多个 npm 镜像的延迟并自动选择最优镜像供 clean-install 使用 | 主要用于优化安装速度 |
| `npm run package` | `build` 的兼容别名 | 兼容旧调用方式 |
| `npm run test:eslint-plugin-prefer-reflect` | 仅运行 prefer-reflect 包测试 | 精确定位该包问题 |
| `npm run test:eslint-formatter-gha:lint` | 仅运行 formatter 的测试脚本 | 精确定位 formatter 问题 |

## 6. 各脚本之间的关系

### 6.1 `verify` 是标准总入口

`npm run verify` 会顺序执行：

1. `npm run check:packages`
2. `npm run build`
3. `npm run lint:ci:run`
4. `npm run test`

也就是说，`verify` 覆盖了：

- 包级元数据一致性检查
- 所有 workspace 构建
- 所有 workspace lint 与根目录 lint
- 所有 workspace 测试

维护者在以下场景应优先使用 `verify`：

- 提交前最终检查
- 合并前自测
- 发布前自测
- 文档中引用标准校验命令时

### 6.2 `lint` 与 `lint:ci` 的区别

- `lint`
  - 适合本地开发
  - 会先检查包元数据，再构建 `eslint-plugin-prefer-reflect`，然后执行 workspace lint 和根目录 lint
- `lint:ci`
  - 面向 CI 场景
  - 会额外构建 `eslint-formatter-gha`，并使用该 formatter 输出结果
- `lint:ci:run`
  - 假设前置检查和构建已完成，只执行 lint 主体
  - `verify` 用它来避免重复执行 `check:packages` 与构建步骤

### 6.3 `build`、`package` 与包内脚本的关系

- 根级 `build` 通过 npm workspaces 调用各包的 `build`
- 根级 `package` 是根级 `build` 的兼容别名
- 各包内部通常也有：
  - `build`
  - `lint`
  - `test`
  - `package`
  - `preversion`
  - `version`

包内 `package` 依然只是 `build` 的别名，主要用于兼容已有流程。

## 7. package.json 元数据同步机制

仓库并不鼓励维护者手工逐个修改 `packages/*/package.json` 中的所有派生字段。

`scripts/postinstall.js` 会根据根配置校验或同步以下内容：

- `repository.directory`
- `homepage`
- `exports`
- 依赖版本范围（基于根依赖安装结果）
- 本地 workspace 依赖版本范围
- `engines.node`
- 与根包相关的 `overrides`

### 7.1 使用原则

- 想确认仓库是否干净：

  ```bash
  npm run check:packages
  ```

- 已经有意修改了根依赖、包导出或相关元数据，想把包 manifest 同步到正确状态：

  ```bash
  npm run sync:packages
  ```

### 7.2 维护建议

- 优先改“源配置”，再运行同步脚本
- 不要先手工改多个包里的派生字段，再去猜脚本会不会覆盖
- 如果 `check:packages` 报错，优先执行 `sync:packages`，而不是直接手工修补

## 8. Changesets 维护流程

仓库使用 [Changesets](https://github.com/changesets/changesets) 管理版本、changelog 与发布。

### 8.1 当前配置含义

`.changeset/config.json` 当前配置的主要含义如下：

- `baseBranch: "master"`
  - 发布自动化以 `master` 为基线判断待发布变更
- `access: "public"`
  - 包按公开 npm 包发布
- `updateInternalDependencies: "patch"`
  - 若某包依赖另一个被升级的本地包，则内部依赖范围按 patch 向前更新
- `commit: false`
  - Changesets 在生成版本更新时不自动提交 commit
- `fixed` / `linked` / `ignore` 为空
  - 默认所有包独立版本管理，除非 changeset 自己同时影响多个包

### 8.2 什么情况下需要写 changeset

一般来说，以下情况应写 changeset：

- 新增功能
- 修复已发布包的缺陷
- 引入 breaking change
- 需要进入 changelog 的对外文档更新

以下情况通常不需要：

- 仅影响仓库维护、不会体现在已发布包中的改动
- 纯 CI / 工具链内部整理，且不会影响发布包消费者

### 8.3 如何编写 changeset

```bash
npm run changeset
```

随后：

1. 选择受影响的已发布包
2. 选择版本类型：
   - `patch`：兼容性修复、小改进
   - `minor`：兼容性新功能
   - `major`：不兼容变更
3. 写明对使用者可见的影响
4. 提交生成的 `.changeset/*.md` 文件

### 8.4 本地预览版本变更

如果需要本地查看版本与 changelog 生成结果：

```bash
npm run version
```

检查生成结果后，如果只是预览，可以自行回滚这些生成文件。

## 9. 发布流程

发布由 [`.github/workflows/npm-publish.yml`](.github/workflows/npm-publish.yml) 驱动。

### 9.1 `master` 上的自动流程

当变更进入 `master` 后，发布工作流会：

1. 检出代码
2. 安装依赖
3. 执行 `npm run verify`
4. 汇总待处理的 changesets
5. 执行 `changesets/action`

随后会发生两种情况之一：

- 如果存在尚未应用的 release note，工作流会创建或更新 release PR
- 如果版本已确定且 npm 上尚未发布，工作流会执行 `npm run release` 发布包

### 9.2 维护者需要知道的边界

- `npm run version` 主要用于本地预览或 release PR 生成流程
- `npm run release` 主要由工作流调用，不建议日常维护中随意手动执行
- 旧的 `scripts/newTag.js` 流程已废弃，不应用于新发布流程

## 10. CI 与自动化说明

### 10.1 Linter 工作流

`.github/workflows/linter.yaml` 会在以下场景触发：

- 匹配路径的 push
- pull request
- merge queue
- 手动触发
- 定时任务

其核心校验命令是：

```bash
npm run verify
```

因此，本地执行 `npm run verify` 与 CI 主校验流程保持一致。

此外，工作流会识别符合命名规则的自动 release commit，并跳过不必要的重复校验。

### 10.2 Publish 工作流

`.github/workflows/npm-publish.yml` 在发布前同样会执行：

```bash
npm run verify
```

这意味着发布链路不会绕过标准校验流程。

### 10.3 Formatter 测试脚本

`@annangela/eslint-formatter-gha` 的测试命令最终会调用：

```bash
bash ../../scripts/eslint-formatter-gha.test.sh
```

该脚本会：

1. 准备本地 summary 文件和 GitHub Actions 风格环境变量
2. 重新构建 formatter 包
3. 使用 formatter 对仓库执行 ESLint

因此无需真实 GitHub Actions 环境，也能验证 formatter 的主要行为。

## 11. 面向维护者的建议

### 11.1 修改依赖时

- 优先修改根 `package.json`
- 安装依赖后运行 `npm run sync:packages`
- 再执行 `npm run verify`

### 11.2 修改导出、包信息或 README 链接时

- 检查是否影响 `exports`、`homepage`、`repository.directory`
- 使用 `npm run check:packages` 或 `npm run sync:packages` 确认派生字段正确

### 11.3 修改脚本、CI 或发布流程时

- 同时检查根 `package.json`、`.github/workflows/*` 与相关 `scripts/*`
- 文档需要同步更新，尤其是本文件与 `.changeset/README.md`
- 最终至少执行一次 `npm run verify`

### 11.4 修改单个包时

- 先用 `--workspace` 做快速反馈
- 再用 `npm run verify` 做全仓确认
- 如影响用户可见行为，记得补 changeset

### 11.5 处理失败时的优先排查顺序

1. 先看 `npm run check:packages` 是否失败
2. 再看构建是否有输出产物差异
3. 再看 `lint` / `lint:ci` 是否依赖某个尚未构建的 workspace
4. 最后再看测试脚本本身是否依赖额外环境变量或临时文件

## 12. 提交前检查清单

在打开 PR 之前，建议至少确认：

- [ ] 文档、代码与脚本说明一致
- [ ] 如有需要，已运行 `npm run sync:packages`
- [ ] 如有用户可见改动，已添加 changeset
- [ ] `npm run verify` 已通过
- [ ] 没有误提交构建产物或无关文件

## 13. 相关文档

- [README.md](README.md)：仓库总览与快速入口
- [.changeset/README.md](.changeset/README.md)：Changesets 快速说明
- [SECURITY.md](SECURITY.md)：安全漏洞报告与处理策略
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)：社区行为准则
