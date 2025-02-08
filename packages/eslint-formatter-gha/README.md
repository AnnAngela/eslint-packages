# AnnAngela/eslint-formatter-gha

A better ESLint formatter used in GitHub Actions. It can help you to get more human-readable annotation from ESLint. See screenshoots below:

![Secreenshoot 1](https://github.com/AnnAngela/eslint-packages/assets/9762652/26a6890c-1d2c-485c-adb0-133645ef16b3)

![Secreenshoot 2](https://github.com/AnnAngela/eslint-packages/assets/9762652/0e02570c-fc07-44d5-99a4-184e07b5be94)

Thess secreenshoots are taken with configuration `ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY` as `notice`, so you can see the deprecated rules infomation in Annotation and Summary.

## Installation

Run this command:

```shell
npm install --save-dev @AnnAngela/eslint-formatter-gha
```

## Usage

Add [`-f @AnnAngela/eslint-formatter-gha` or `--format @AnnAngela/eslint-formatter-gha`](https://eslint.org/docs/latest/use/command-line-interface#-f---format) to your eslint command, like this:

```shell
npx eslint -f @AnnAngela/eslint-formatter-gha src
```

## Configuration

You can use these **environment variables** to configure the formatter:

* `ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY`:

  Valid value is `debug` ~~(default in v1 and v2)~~, `notice`, `warning` (**default in v3**), `error`.

  If the value is `debug`, the report of the deprecated rules will be only logged as debug log, which you have to enable [debug logging](https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging) to see it.

## Migrating to v3

According to [the blog "Deprecation of formatting rules"](https://eslint.org/blog/2023/10/deprecating-formatting-rules/) and [the release note of ESLint v8.53](https://eslint.org/blog/2023/11/eslint-v8.53.0-released/), a batch of formatting rules have been marked as deprecated in documents.

So in v3, the default value of environment variable `ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY` will be changed to `warning`, to make the deprecated rules more noticeable.

If you want to keep the old behavior, you can set the environment variable `ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY` to `debug`.

And this is the only breaking change in v3.
