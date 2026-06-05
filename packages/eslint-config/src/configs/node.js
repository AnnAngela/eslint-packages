import nodePlugin from "eslint-plugin-n";
import securityPlugin from "eslint-plugin-security";

import globals from "globals";
/**
 * @type { Omit<import("eslint").Linter.Config, "files" | "ignores"> }
 */
const config = { // `nodeConfig`: For files used in Node.js
    name: "annangela/node",
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
        // 强制 `module.exports` 而非裸 `exports`。
        // 此规则仅在有 `module`/`exports` 变量的 CJS 文件中生效
        // （scope manager 在 ESM 文件中不注册这两个变量，规则自然跳过）。
        // 纯 ESM 项目无需额外配置即可安全使用。
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
        "n/no-missing-import": ["error", { ignoreTypeImport: true }],

        // securityPlugin
        ...securityPlugin.configs.recommended.rules,
    },
};
export default config;
