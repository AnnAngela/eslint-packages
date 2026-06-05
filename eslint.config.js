// import packageJSON from "./package.json" with { type: "json" };
import { defineConfig } from "eslint/config";
import fs from "node:fs";
import { configs } from "./packages/eslint-config/src/index.js";

/**
 * @type { import("./package.json") }
 */
const packageJSON = JSON.parse(await fs.promises.readFile("./package.json", "utf-8"));

/**
 * @type { import("eslint").Linter.Config[] }
 */
const config = defineConfig([
    // Global ignores
    {
        ignores: [
            "**/dist/**",
            "**/.*/**",
            "**/coverage/**",
            "**/vitest.config.*",
            "node_modules",
        ],
    },
    // base
    {
        ...configs.base,
        files: [
            "**/*.js",
            "**/*.ts",
        ],
    },
    {
        ...configs.node,
        files: [
            "**/*.js",
            "**/*.ts",
        ],
    },
    // plugins
    {
        ...configs.eslintPlugin,
        files: [
            "packages/eslint-plugin-prefer-reflect/**",
        ],
    },
    {
        files: [
            "packages/eslint-plugin-prefer-reflect/**",
        ],
        rules: {
            "n/no-sync": "off",
        },
    },
    {
        ...configs.mocha,
        files: [
            "packages/eslint-plugin-prefer-reflect/tests/**",
        ],
    },
    // For TypeScript files
    {
        ...configs.typescript,
        files: [
            "**/*.ts",
        ],
    },
    // prefer-reflect 插件源码在分析 AST 时不可避免地使用动态属性访问
    // （如 node.callee.property?.name, sourceCode.getScope(node), exceptions.includes() 等），
    // 所有键来自 ESLint 解析器 (estree AST nodes) 和硬编码常量 (EXCEPTION_NAMES)，
    // 而非用户输入，不存在注入风险。
    {
        files: [
            "packages/eslint-plugin-prefer-reflect/src/**",
        ],
        rules: {
            "security/detect-object-injection": "off",
        },
    },
    // formatter uses sync fs methods (ActionsSummary needs sync writes
    // for GHA step summary capture; tests use tmp file ops synchronously)
    {
        files: [
            "packages/eslint-formatter-gha/**",
        ],
        rules: {
            "n/no-sync": "off",
        },
    },
    // formatter 在迭代中动态访问 ESLint LintResult/LintMessage 结构：
    // results[].messages[], ruleId, replacedBy, severity, line, column 等属性。
    // 所有键来自 ESLint core 的标准 API (ESLint.Linter.LintMessage)，
    // 非用户输入，不存在注入风险。
    {
        files: [
            "packages/eslint-formatter-gha/src/**",
        ],
        rules: {
            "security/detect-object-injection": "off",
        },
    },
    {
        files: [
            "scripts/**/*",
            "**/scripts/**/*",
            "eslint.config.js",
        ],
        rules: {
            // Running in trusted environment
            "security/detect-unsafe-regex": "off",
            "security/detect-object-injection": "off",
            "security/detect-non-literal-fs-filename": "off",
            "security/detect-non-literal-regexp": "off",
            "security/detect-child-process": "off",
            "n/no-extraneous-import": "off",
            "n/no-process-exit": "off",

            "n/no-unsupported-features/node-builtins": ["error", { version: packageJSON.engines.node }],
            "n/no-unsupported-features/es-builtins": ["error", { version: packageJSON.engines.node }],
            "n/no-unsupported-features/es-syntax": ["error", { version: packageJSON.engines.node }],
        },
    },
    // Test files: allow non-literal fs filenames and object injection for testing purposes
    {
        files: [
            "**/*.test.ts",
            "**/*.test.js",
            "**/*.spec.ts",
            "**/*.spec.js",
        ],
        rules: {
            "security/detect-non-literal-fs-filename": "off",
            "security/detect-object-injection": "off",
        },
    },
]);
export default config;
