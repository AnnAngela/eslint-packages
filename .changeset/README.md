# 本仓库中的 Changesets 使用说明

本仓库使用 [Changesets](https://github.com/changesets/changesets) 管理发布说明、版本号与 npm 发布流程。

## 快速开始

1. 在仓库根目录执行 `npm run changeset`
2. 选择本次改动影响到的已发布包
3. 选择合适的版本类型：`patch`、`minor` 或 `major`
4. 写一段简洁的中文说明，描述这次变更对使用者的影响
5. 将生成的 `.changeset/*.md` 文件与相关改动一起提交

## 仓库特定规则

- 基线分支是 `master`
- 所有包按 public npm package 发布
- 当本地 workspace 之间存在依赖关系时，内部依赖范围会按 patch 自动前推
- Changesets 不会自动提交版本更新结果，版本提交由正常的发布流程处理

## 发布流程

- 通过常规 PR 流程将 changeset 合并到 `master`
- 发布工作流会执行 `changesets/action`
- 如果存在待处理的发布说明，工作流会创建或更新 release PR
- 如果存在已经版本化但尚未发布的包，工作流会执行 `npm run release`

更完整的维护说明请查看 [`../CONTRIBUTING.md`](../CONTRIBUTING.md)。
