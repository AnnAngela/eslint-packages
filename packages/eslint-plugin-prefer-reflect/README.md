# @annangela/eslint-plugin-prefer-reflect

这个包提供 ESLint 规则，用现代的 Reflect API 写法替代传统的旧式 API 写法。

## 安装

首先请先安装 [ESLint](https://eslint.org/)：

```sh
npm i eslint --save-dev
```

然后安装 `@annangela/eslint-plugin-prefer-reflect`：

```sh
npm install @annangela/eslint-plugin-prefer-reflect --save-dev
```

## 使用

### `eslint.config.js`（Flat Config）

```js
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

### `.eslintrc`（已废弃）

在 `.eslintrc` 的 `plugins` 中加入 `@annangela/prefer-reflect`：

```json
{
    "plugins": [
        "@annangela/prefer-reflect"
    ]
}
```

然后在 `rules` 中启用对应规则：

```json
{
    "rules": {
        "@annangela/prefer-reflect/prefer-reflect": "error"
    }
}
```

虽然规则名看起来重复，但这是 ESLint 对 scoped plugin 规则命名的既定格式。

## 已提供的规则

- [`@annangela/prefer-reflect/prefer-reflect`](docs/rules/prefer-reflect.md)：规则完整说明
