import eslintPlugin from "eslint-plugin-eslint-plugin";

/**
 * @type { Omit<import("eslint").Linter.Config, "files" | "ignores"> }
 */
const config = {
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    plugins: eslintPlugin.configs["flat/recommended"].plugins,
    rules: {
        ...eslintPlugin.configs["flat/recommended"].rules,
    },
};
export default config;
