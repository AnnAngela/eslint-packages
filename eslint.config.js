import { configs } from "./packages/eslint-config/src/index.js";
/**
 * @type { import("eslint").Linter.FlatConfigFileSpec }
 */
const ignores = [
    "**/dist/**",
    "**/.*/**",
    "node_modules",
];
/**
 * @type { import("eslint").Linter.FlatConfig[] }
 */
const config = [
    {
        ...configs.base,
        ignores,
    },
    {
        ...configs.node,
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
        ...configs.base,
        files: [
            "**/*.ts",
        ],
        ignores,
    },
    {
        ...configs.node,
        files: [
            "**/*.ts",
        ],
        ignores,
    },
    {
        ...configs.typescript,
        files: [
            "**/*.ts",
        ],
        ignores,
    },
];
export default config;
