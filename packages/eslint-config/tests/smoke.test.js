import { describe, it, expect } from "vitest";
import { ESLint } from "eslint";
import configs from "../src/index.js";

describe("eslint-config smoke tests", () => {
    it("should load base config and lint valid JavaScript code without errors", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: configs.configs.base,
        });

        // `_x` prefix allows unused vars per ESLint default no-unused-vars config
        const results = await eslint.lintText("const _x = 1;\n");

        expect(results).toHaveLength(1);
        expect(results[0].errorCount).toBe(0);
        expect(results[0].warningCount).toBe(0);
    });

    it("should load node config and detect CJS require of bare specifier", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: configs.configs.node,
        });

        // `require('fs')` should trigger n/prefer-node-protocol (use node:fs instead)
        const results = await eslint.lintText("const fs = require('fs');\n");

        expect(results).toHaveLength(1);
        const nodeProtocolErrors = results[0].messages.filter(
            (m) => m.ruleId === "n/prefer-node-protocol",
        );
        expect(nodeProtocolErrors.length).toBeGreaterThan(0);
    });

    it("should load typescript config with valid parser and parserOptions", () => {
        const config = configs.configs.typescript;

        // Verify parser module is loaded and has expected API
        expect(config.languageOptions.parser).toBeDefined();
        expect(typeof config.languageOptions.parser.parseForESLint).toBe("function");

        // Verify parserOptions structure
        expect(config.languageOptions.parserOptions).toBeDefined();
        expect(config.languageOptions.parserOptions.ecmaVersion).toBe(2024);
        expect(config.languageOptions.parserOptions.projectService).toBe(true);

        // Verify TS plugin and rules are present
        expect(config.plugins["@typescript-eslint"]).toBeDefined();
        expect(config.rules).toBeDefined();
        // Verify at least one known TS rule exists
        expect(typeof config.rules["@typescript-eslint/prefer-nullish-coalescing"]).toBe("object");
    });

    it("should export all expected configs as objects", () => {
        const expectedConfigs = ["base", "browser", "eslintPlugin", "mocha", "node", "typescript"];
        for (const name of expectedConfigs) {
            const config = configs.configs[name];
            expect(config, `configs.${name} should be defined`).toBeDefined();
            expect(typeof config, `configs.${name} should be an object`).toBe("object");
        }
    });

    it("should export forkedGlobals with actual global entries", () => {
        expect(typeof configs.forkedGlobals, "forkedGlobals should be an object").toBe("object");

        const expectedGlobals = ["jquery", "greasemonkey", "mocha"];
        for (const name of expectedGlobals) {
            const globals = configs.forkedGlobals[name];
            expect(globals, `forkedGlobals.${name} should be defined`).toBeDefined();
            expect(typeof globals, `forkedGlobals.${name} should be an object`).toBe("object");
            // Each global set should contain actual entries
            expect(
                Object.keys(globals).length,
                `forkedGlobals.${name} should have at least one entry`,
            ).toBeGreaterThan(0);
        }
    });
});
