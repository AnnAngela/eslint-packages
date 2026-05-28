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
    // formatter-gha test files: allow project service to use default project for test files not in tsconfig
    {
        files: [
            "packages/eslint-formatter-gha/src/*.test.ts",
        ],
        ignores,
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ["src/*.test.ts"],
                },
            },
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
];
export default config;
