import { configs } from "./packages/eslint-config/src/index.js";
/**
 * @type { import("eslint").Linter.Config["ignores"] }
 */
const ignores = [
    "**/dist/**",
    "**/.*/**",
    "node_modules",
];
/**
 * @type { import("eslint").Linter.Config[] }
 */
const config = [
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

            /* "n/no-unsupported-features/node-builtins": ["error", { version: "^22.11" }],
            "n/no-unsupported-features/es-builtins": ["error", { version: "^22.11" }],
            "n/no-unsupported-features/es-syntax": ["error", { version: "^22.11" }], */
        },
    },
];
export default config;
