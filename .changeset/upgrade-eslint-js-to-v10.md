---
"@annangela/eslint-config": major
"@annangela/eslint-formatter-gha": none
"@annangela/eslint-plugin-prefer-reflect": none
---

build(deps)!: upgrade @eslint/js from v9.39.4 to v10.0.1

- Add 3 new rules to eslint-recommended: no-unassigned-vars, no-useless-assignment, preserve-caught-error
- Restore `name` property on eslint-recommended config (@eslint/js/recommended)
- Add peerDependencies: eslint ^10.0.0 (optional)
- Add engines.node: ^20.19.0 || ^22.13.0 || >=24
