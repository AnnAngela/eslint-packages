// import packageJSON from "./package.json" with { type: "json" };
import fs from "node:fs";
import { configs } from "./packages/eslint-config/src/index.js";

/**
 * @type { import("./package.json") }
 */
const packageJSON = JSON.parse(await fs.promises.readFile("./package.json", "utf-8"));

/**
 * @type { import("eslint").Linter.Config["ignores"] }
 */
const ignores = [
    "**/dist/**",
    "**/.*/**",
    "**/coverage/**",
    "**/vitest.config.*",
    "node_modules",
];
/**
 * @type { import("eslint").Linter.Config[] }
 */
const config = [
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
        ignores,
    },
    {
        ...configs.node,
        files: [
            "**/*.js",
            "**/*.ts",
        ],
        ignores,
    },
    // plugins
    {
        ...configs.eslintPlugin,
        files: [
            "packages/eslint-plugin-prefer-reflect/**",
        ],
        ignores,
    },
    {
        files: [
            "packages/eslint-plugin-prefer-reflect/**",
        ],
        ignores,
        rules: {
            "n/no-sync": "off",
        },
    },
    {
        ...configs.mocha,
        files: [
            "packages/eslint-plugin-prefer-reflect/tests/**",
        ],
        ignores,
    },
    // For TypeScript files
    {
        ...configs.typescript,
        files: [
            "**/*.ts",
        ],
        ignores,
    },
    // prefer-reflect 插件源码在分析 AST 时不可避免地使用动态属性访问，
    // 所有键来自 ESLint 解析器而非用户输入，不存在注入风险。
    {
        files: [
            "packages/eslint-plugin-prefer-reflect/src/**",
        ],
        ignores,
        rules: {
            "security/detect-object-injection": "off",
        },
    },
    // formatter still requires CommonJS, so there is no top-level async/await and we have to use `Sync` methods
    {
        files: [
            "packages/eslint-formatter-gha/**",
        ],
        ignores,
        rules: {
            "n/no-sync": "off",
        },
    },
    // formatter 处理 ESLint 输出的数据结构，动态键来自 ESLint core，
    // 非用户输入，不存在注入风险。
    {
        files: [
            "packages/eslint-formatter-gha/src/**",
        ],
        ignores,
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
];
export default config;
