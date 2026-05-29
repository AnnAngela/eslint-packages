import { describe, it, expect } from "vitest";
import { ESLint } from "eslint";
import configs from "../src/index.js";

describe("eslint-config smoke tests", () => {
    it("should load base config and lint JavaScript code", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: configs.configs.base,
        });

        const results = await eslint.lintText("const x = 1;\n");

        expect(results).toHaveLength(1);
        expect(results[0].messages).toBeDefined();
    });

    it("should load node config and lint Node.js code", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: configs.configs.node,
        });

        const results = await eslint.lintText("const fs = require('fs');\n");

        expect(results).toHaveLength(1);
        expect(results[0].messages).toBeDefined();
    });

    it("should load typescript config without errors", () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: configs.configs.typescript,
        });

        // TypeScript config requires parser, so we just verify it loads
        expect(eslint).toBeDefined();
    });

    it("should export all expected configs", () => {
        expect(configs.configs.base).toBeDefined();
        expect(configs.configs.browser).toBeDefined();
        expect(configs.configs.node).toBeDefined();
        expect(configs.configs.typescript).toBeDefined();
        expect(configs.configs.eslintPlugin).toBeDefined();
        expect(configs.configs.mocha).toBeDefined();
    });

    it("should export forkedGlobals", () => {
        expect(configs.forkedGlobals).toBeDefined();
        expect(configs.forkedGlobals.jquery).toBeDefined();
        expect(configs.forkedGlobals.greasemonkey).toBeDefined();
        expect(configs.forkedGlobals.mocha).toBeDefined();
    });
});
