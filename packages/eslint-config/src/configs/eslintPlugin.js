import eslintPlugin from "eslint-plugin-eslint-plugin";

/**
 * @type { Omit<import("eslint").Linter.FlatConfig, "files" | "ignores"> }
 */
const config = {
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    plugins: {
        [eslintPlugin.configs.recommended.plugins[0]]: eslintPlugin,
    },
    rules: {
        ...eslintPlugin.configs.recommended.rules,
    },
};
export default config;
