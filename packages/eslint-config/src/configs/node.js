import nodePlugin from "eslint-plugin-n";
import securityPlugin from "eslint-plugin-security";

import globals from "globals";
/**
 * @type { Omit<import("eslint").Linter.FlatConfig, "files" | "ignores"> }
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

        // securityPlugin
        ...securityPlugin.configs.recommended.rules,
    },
};
export default config;
