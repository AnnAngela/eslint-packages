---
"@annangela/eslint-formatter-gha": minor
"@annangela/eslint-plugin-prefer-reflect": minor
---

build: add `peerDependencies.eslint: ^10.0.0` to formatter and plugin packages

ESLint plugins and formatters should declare ESLint as a peer dependency to express compatibility with the host tool. This aligns with ESLint's official plugin development guidelines and matches the existing `peerDependencies` in `@annangela/eslint-config`.
