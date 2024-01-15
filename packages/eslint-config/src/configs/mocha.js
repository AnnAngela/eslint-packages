import forkedGlobals from "../forkedGlobals.js";

/**
 * @type { Omit<import("eslint").Linter.FlatConfig, "files" | "ignores"> }
 */
const config = {
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
        globals: {
            ...forkedGlobals.mocha,
        },
    },
};
export default config;
