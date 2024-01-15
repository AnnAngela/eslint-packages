# eslint-plugin-prefer-reflect

Main propose:

- Modern version of original `prefer-reflect` rules in eslint

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@annangela/eslint-plugin-prefer-reflect`:

```sh
npm install @annangela/eslint-plugin-prefer-reflect --save-dev
```

## Usage

### `eslint.config.js` - flat config

Use the plugin:

```js
import preferReflectPlugin from "@annangela/eslint-plugin-prefer-reflect";

// ...

export default {
    // ...
    plugins: {
        // ...
        "@annangela/prefer-reflect": preferReflectPlugin,
        // ...
    },
    rules: {
        // ...

        // @annangela/prefer-reflect
        "@annangela/prefer-reflect/prefer-reflect": "error",

        // ...
    },
};
```

### `.eslintrc` (Deprecated)

Add `@annangela/eslint-plugin-prefer-reflect` to the plugins section of your `.eslintrc` configuration file:

```json
{
    "plugins": [
        "@annangela/prefer-reflect"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@annangela/prefer-reflect/prefer-reflect": "error"
    }
}
```

I know this repeated words looks stupid, but the eslint requires this format.

## Supported Rules

- [`@annangela/prefer-reflect/prefer-reflect`](packages/eslint-plugin-prefer-reflect/docs/rules/prefer-reflect.md): Please look up [the doc link](packages/eslint-plugin-prefer-reflect/docs/rules/prefer-reflect.md).
