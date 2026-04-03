# @annangela/eslint-formatter-gha

这是一个面向 GitHub Actions 的 ESLint Formatter，可以把 ESLint 结果转换成更易读的注解与摘要信息。

下图展示了 formatter 的输出效果：

![示意图 1](https://github.com/AnnAngela/eslint-packages/assets/9762652/26a6890c-1d2c-485c-adb0-133645ef16b3)

![示意图 2](https://github.com/AnnAngela/eslint-packages/assets/9762652/0e02570c-fc07-44d5-99a4-184e07b5be94)

以上截图在 `ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY=notice` 的配置下生成，因此可以在 Annotation 与 Summary 中看到废弃规则相关信息。

## 安装

```shell
npm install --save-dev @annangela/eslint-formatter-gha
```

## 使用

在 ESLint 命令中加入 [`-f @annangela/eslint-formatter-gha` 或 `--format @annangela/eslint-formatter-gha`](https://eslint.org/docs/latest/use/command-line-interface#-f---format)，例如：

```shell
npx eslint -f @annangela/eslint-formatter-gha src
```

## 配置

可以通过以下环境变量配置 formatter：

- `ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY`

  可选值为：`debug`、`notice`、`warning`、`error`。

  其中：

  - `debug`：v1 / v2 中的默认值
  - `warning`：v3 中的默认值

  当值为 `debug` 时，废弃规则信息只会以 debug 日志方式输出；如果要查看这些内容，需要先开启 [GitHub Actions debug logging](https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging)。

## 升级到 v3

根据 [Deprecation of formatting rules](https://eslint.org/blog/2023/10/deprecating-formatting-rules/) 与 [ESLint v8.53.0 发布说明](https://eslint.org/blog/2023/11/eslint-v8.53.0-released/)，一批格式化规则已在文档中被标记为废弃。

因此从 v3 开始，`ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY` 的默认值改为 `warning`，以便让这些废弃规则更容易被注意到。

如果你希望保留旧行为，可以显式设置：

```shell
ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY=debug
```

这也是 v3 的主要兼容性变化。
