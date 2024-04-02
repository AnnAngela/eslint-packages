/* eslint-disable security/detect-non-literal-fs-filename */
import { createRequire } from "node:module";
import fs from "node:fs";
import eslintPlugin from "eslint-plugin-eslint-plugin";
/**
 * @type { import("eslint-plugin-eslint-plugin/package.json") }
 */
const pluginMetadata = JSON.parse(await fs.promises.readFile(createRequire(import.meta.url).resolve("eslint-plugin-eslint-plugin/package.json")));
const pluginName = pluginMetadata.name.replace(/^eslint-plugin-/, "");

/**
 * @type { Omit<import("eslint").Linter.FlatConfig, "files" | "ignores"> }
 */
const config = {
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    plugins: {
        [pluginName]: eslintPlugin,
    },
    rules: {
        ...eslintPlugin.configs["flat/recommended"].rules,
    },
};
export default config;
