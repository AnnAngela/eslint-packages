import globals from "globals";
import forkedGlobals from "../forkedGlobals.js";

/**
 * @type { Omit<import("eslint").Linter.FlatConfig, "files" | "ignores"> }
 */
const config = { // `browserConfig`: For files used in browser
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
        globals: {
            ...globals.browser,
            ...forkedGlobals.jquery,
        },
    },
};
export default config;
