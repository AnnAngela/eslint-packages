---
"@annangela/eslint-config": major
"@annangela/eslint-formatter-gha": none
"@annangela/eslint-plugin-prefer-reflect": none
---

fix(deps)!: update dependency @stylistic/eslint-plugin to v6

The customized preset now behaves differently, which is noticeable to downstream consumers:

- Promote `list-style` into the customized preset: multiline destructuring and call arguments now require one member per line
- `indent`: enforce property value indentation, remove deprecated options
- `no-multi-spaces`: default `exceptions` is now empty
- `dot-location`: default option changed to `property`
- `keyword-spacing`: treat `for await` as `for` for spacing checks
- `space-before-blocks`: now also handles space before class body `{`
- `type-annotation-spacing`: remove `overrides.arrow`, remake `overrides` options
- Remove `jsx-indent`, `jsx-props-no-multi-spaces`, `jsx-sort-props` (none of them were enabled in this config)
