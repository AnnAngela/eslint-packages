import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
/**
 * @type { Omit<import("eslint").Linter.Config, "files" | "ignores"> & { languageOptions: import("eslint").Linter.Config["languageOptions"] & { parserOptions: import("@typescript-eslint/parser").ParserOptions } } }
 */
const config = { // `typescriptConfig`: For TypeScript files
    name: "annangela/typescript",
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
        parser: typescriptParser,
        parserOptions: {
            projectService: true,
            ecmaVersion: 2024,
            jsDocParsingMode: "all",
            lib: [ // Node 24 - https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases
                "es2024",
                "ESNext.Array",
                "ESNext.Collection",
                "ESNext.Error",
                "ESNext.Iterator",
                "ESNext.Promise",
            ],
        },
    },
    plugins: {
        "@typescript-eslint": typescriptPlugin,
    },
    rules: {
        // `eslint-recommended` (eslintrc format) uses `overrides`, not `rules`, so this spread is a no-op.
        // `strict-type-checked` already includes `"no-unused-vars": "off"` and
        // `"@typescript-eslint/no-unused-vars": "error"`.
        // ...typescriptPlugin.configs["eslint-recommended"].rules,
        ...typescriptPlugin.configs["strict-type-checked"].rules,
        // `stylistic-type-checked` 预设中的规则对应 `@typescript-eslint` 尚未
        // 迁移到 `@stylistic/eslint-plugin` 的剩余 formatting 规则
        // （如 member-delimiter-style、method-signature-style）。该预设已与
        // `@stylistic` 对齐，不会产生重复或冲突的规则。
        // 参见：https://typescript-eslint.io/users/what-about-formatting
        ...typescriptPlugin.configs["stylistic-type-checked"].rules,
        "@typescript-eslint/consistent-type-imports": [
            "error",
            {
                prefer: "type-imports",
                fixStyle: "separate-type-imports",
            },
        ],
        "@typescript-eslint/consistent-type-exports": [
            "error",
            {
                fixMixedExportsWithInlineTypeSpecifier: false,
            },
        ],
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
