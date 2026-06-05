import eslintPlugin from "eslint-plugin-eslint-plugin";

/**
 * @type { Omit<import("eslint").Linter.Config, "files" | "ignores"> }
 */
const config = {
    name: "annangela/eslint-plugin",
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    plugins: eslintPlugin.configs.recommended.plugins,
    rules: {
        ...eslintPlugin.configs.recommended.rules,
    },
};
export default config;
