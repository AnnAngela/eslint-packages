import base from "./configs/base.js";
import browser from "./configs/browser.js";
import eslintPlugin from "./configs/eslintPlugin.js";
import mocha from "./configs/mocha.js";
import node from "./configs/node.js";
import typescript from "./configs/typescript.js";
import forkedGlobals from "./forkedGlobals.js";

const configs = { base, browser, eslintPlugin, mocha, node, typescript };
export { configs, forkedGlobals };
export default { configs, forkedGlobals };
