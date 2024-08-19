import globals from "globals";
import forkedGlobals from "../forkedGlobals.js";

/**
 * @type { Omit<import("eslint").Linter.Config, "files" | "ignores"> }
 */
const config = { // `browserConfig`: For files used in browser
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
        ecmaVersion: "latest",
        sourceType: "script",
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        globals: {
            ...globals.browser,
            ...forkedGlobals.jquery,
        },
    },
};
export default config;
