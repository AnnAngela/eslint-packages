import base from "./configs/base.js";
import browser from "./configs/browser.js";
import eslintPlugin from "./configs/eslintPlugin.js";
import mocha from "./configs/mocha.js";
import node from "./configs/node.js";
import typescript from "./configs/typescript.js";
import forkedGlobals from "./forkedGlobals.js";

/** @type {Record<string, import("eslint").Linter.Config>} */
const configs = { base, browser, eslintPlugin, mocha, node, typescript };

/** @type {{ configs: typeof configs; forkedGlobals: typeof forkedGlobals }} */
const exported = { configs, forkedGlobals };
export { configs, forkedGlobals };
export default exported;
