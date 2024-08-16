import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
/**
 * @type { Omit<import("eslint").Linter.Config, "files" | "ignores"> }
 */
const config = { // `typescriptConfig`: For TypeScript files
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
        parser: typescriptParser,
        parserOptions: {
            project: "tsconfig.json",
            lib: [
                "es2023", // Node 20 - https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases
            ],
        },
    },
    plugins: {
        "@typescript-eslint": typescriptPlugin,
    },
    rules: {
        ...typescriptPlugin.configs["eslint-recommended"].rules,
        ...typescriptPlugin.configs["strict-type-checked"].rules,
        ...typescriptPlugin.configs["stylistic-type-checked"].rules,
        "@typescript-eslint/prefer-nullish-coalescing": [
            "error",
            {
                ignoreConditionalTests: true,
            },
        ],
        "@typescript-eslint/restrict-template-expressions": [
            "error",
            { // 除 allowNumber 外均为默认选项
                allowAny: false,
                allowBoolean: false,
                allowNullish: false,
                allowNumber: true,
                allowRegExp: false,
                allowNever: false,
            },
        ],
    },
};
export default config;
