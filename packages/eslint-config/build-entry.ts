import type { Linter } from "eslint";

import base from "./src/configs/base.js";
import browser from "./src/configs/browser.js";
import eslintPlugin from "./src/configs/eslintPlugin.js";
import mocha from "./src/configs/mocha.js";
import node from "./src/configs/node.js";
import typescript from "./src/configs/typescript.js";
import forkedGlobals from "./src/forkedGlobals.js";

const configs: Record<string, Linter.Config> = {
    base,
    browser,
    eslintPlugin,
    mocha,
    node,
    typescript,
};

const exportedForkedGlobals: Record<string, Record<string, boolean>> = forkedGlobals;

const exported: {
    configs: typeof configs;
    forkedGlobals: typeof exportedForkedGlobals;
} = {
    configs,
    forkedGlobals: exportedForkedGlobals,
};

export { configs, exportedForkedGlobals as forkedGlobals };
export default exported;
