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

- [`@annangela/prefer-reflect/prefer-reflect`](docs/rules/prefer-reflect.md): Please look up [the doc link](docs/rules/prefer-reflect.md).
