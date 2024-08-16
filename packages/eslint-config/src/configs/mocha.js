import forkedGlobals from "../forkedGlobals.js";

/**
 * @type { Omit<import("eslint").Linter.Config, "files" | "ignores"> }
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
