import nodePlugin from "eslint-plugin-n";
import securityPlugin from "eslint-plugin-security";

import globals from "globals";
/**
 * @type { Omit<import("eslint").Linter.Config, "files" | "ignores"> }
 */
const config = { // `nodeConfig`: For files used in Node.js
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
        sourceType: "module",
        parserOptions: {
            sourceType: "module",
        },
        globals: {
            ...globals.node,
            ...globals.nodeBuiltin,
        },
    },
    plugins: {
        ...nodePlugin.configs["flat/recommended-module"].plugins,
        ...securityPlugin.configs.recommended.plugins,
    },
    rules: {
        // nodePlugin
        ...nodePlugin.configs["flat/recommended-module"].rules,
        "n/exports-style": [
            "error",
            "module.exports",
        ],
        "n/file-extension-in-import": [
            "error",
            "always",
        ],
        "n/global-require": "error",
        "n/no-mixed-requires": [
            "error",
            {
                allowCall: true,
            },
        ],
        "n/no-new-require": "error",
        "n/no-path-concat": "error",
        "n/no-sync": [
            "error",
            {
                allowAtRootLevel: false,
            },
        ],
        "n/prefer-promises/dns": "error",
        "n/prefer-promises/fs": "error",
        "n/prefer-node-protocol": "error",
        "n/no-unsupported-features/node-builtins": ["error", { version: "^20.11 || ^22.11" }],
        "n/no-unsupported-features/es-builtins": ["error", { version: "^20.11 || ^22.11" }],
        "n/no-unsupported-features/es-syntax": ["error", { version: "^20.11 || ^22.11" }],

        // securityPlugin
        ...securityPlugin.configs.recommended.rules,
    },
};
export default config;
