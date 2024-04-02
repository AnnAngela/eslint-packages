import eslintPlugin from "eslint-plugin-eslint-plugin";

/**
 * @type { Omit<import("eslint").Linter.FlatConfig, "files" | "ignores"> }
 */
const config = {
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    plugins: {
        [eslintPlugin.configs["flat/recommended"].plugins[0]]: eslintPlugin,
    },
    rules: {
        ...eslintPlugin.configs["flat/recommended"].rules,
    },
};
export default config;
