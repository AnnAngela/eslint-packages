---
"@annangela/eslint-config": none
"@annangela/eslint-formatter-gha": none
"@annangela/eslint-plugin-prefer-reflect": none
---

build: migrate package manager from npm to pnpm 11.4

- Switch to pnpm via corepack with packageManager field
- Update all scripts and CI workflows to use pnpm commands
- Replace npm workspaces with pnpm-workspace.yaml
