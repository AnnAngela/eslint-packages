---
"@annangela/eslint-config": none
"@annangela/eslint-formatter-gha": none
"@annangela/eslint-plugin-prefer-reflect": none
---

**包管理器迁移至 pnpm**

- 从 npm 迁移至 pnpm 11.4，通过 corepack 管理版本
- 所有脚本和 CI 工作流更新为使用 pnpm 命令
- 以 `pnpm-workspace.yaml` 替代 npm workspaces 配置
- 更新 `packageManager` 字段，统一团队开发环境

---

**Package manager migration to pnpm**

- Migrated from npm to pnpm 11.4, managed via corepack
- All scripts and CI workflows updated to use pnpm commands
- Replaced npm workspaces configuration with `pnpm-workspace.yaml`
- Updated the `packageManager` field to ensure a consistent development environment across the team
