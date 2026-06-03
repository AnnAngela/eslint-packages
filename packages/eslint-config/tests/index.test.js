/**
 * @fileoverview Tests for eslint-config package
 * @author AnnAngela
 */

import { describe, test, expect } from "vitest";
import { configs, forkedGlobals } from "../src/index.js";

describe("eslint-config", () => {
    describe("configs exports", () => {
        test("should export all required configs", () => {
            expect(configs).toBeDefined();
            expect(configs.base).toBeDefined();
            expect(configs.browser).toBeDefined();
            expect(configs.eslintPlugin).toBeDefined();
            expect(configs.mocha).toBeDefined();
            expect(configs.node).toBeDefined();
            expect(configs.typescript).toBeDefined();
        });

        test("should have correct config structure for base", () => {
            const config = configs.base;
            expect(config.linterOptions).toBeDefined();
            expect(config.linterOptions.reportUnusedDisableDirectives).toBe("error");
            expect(config.linterOptions.reportUnusedInlineConfigs).toBe("error");
            expect(config.languageOptions).toBeDefined();
            expect(config.languageOptions.ecmaVersion).toBe(2024);
            expect(config.plugins).toBeDefined();
            expect(config.rules).toBeDefined();
        });

        test("should have correct config structure for browser", () => {
            const config = configs.browser;
            expect(config.linterOptions).toBeDefined();
            expect(config.linterOptions.reportUnusedDisableDirectives).toBe("error");
            expect(config.languageOptions).toBeDefined();
            expect(config.languageOptions.ecmaVersion).toBe("latest");
            expect(config.languageOptions.sourceType).toBe("script");
        });

        test("should have correct config structure for eslintPlugin", () => {
            const config = configs.eslintPlugin;
            expect(config.linterOptions).toBeDefined();
            expect(config.linterOptions.reportUnusedDisableDirectives).toBe("error");
            expect(config.plugins).toBeDefined();
            expect(config.rules).toBeDefined();
        });

        test("should have correct config structure for mocha", () => {
            const config = configs.mocha;
            expect(config.linterOptions).toBeDefined();
            expect(config.linterOptions.reportUnusedDisableDirectives).toBe("error");
            expect(config.languageOptions).toBeDefined();
            expect(config.languageOptions.globals).toBeDefined();
        });

        test("should have correct config structure for node", () => {
            const config = configs.node;
            expect(config.linterOptions).toBeDefined();
            expect(config.linterOptions.reportUnusedDisableDirectives).toBe("error");
            expect(config.languageOptions).toBeDefined();
            expect(config.languageOptions.sourceType).toBe("module");
            expect(config.plugins).toBeDefined();
            expect(config.rules).toBeDefined();
        });

        test("should have correct config structure for typescript", () => {
            const config = configs.typescript;
            expect(config.linterOptions).toBeDefined();
            expect(config.linterOptions.reportUnusedDisableDirectives).toBe("error");
            expect(config.languageOptions).toBeDefined();
            expect(config.languageOptions.parser).toBeDefined();
            expect(config.languageOptions.parserOptions).toBeDefined();
            expect(config.languageOptions.parserOptions.projectService).toBe(true);
            expect(config.plugins).toBeDefined();
            expect(config.rules).toBeDefined();
        });
    });

    describe("base config rules", () => {
        test("should have recommended ESLint rules", () => {
            const rules = configs.base.rules;
            expect(rules.camelcase).toBe("error");
            expect(rules.curly).toBe("error");
            expect(rules["dot-notation"]).toBe("error");
            expect(rules.eqeqeq).toBe("error");
            expect(rules["no-console"]).toBe("off");
            expect(rules["no-else-return"]).toBe("error");
            expect(rules["no-var"]).toBe("error");
            expect(rules["prefer-const"]).toBe("error");
            expect(rules["prefer-template"]).toBe("error");
            expect(rules.strict).toEqual(["error", "global"]);
        });

        test("should have stylistic rules", () => {
            const rules = configs.base.rules;
            // @stylistic/indent: 4-space indent with SwitchCase
            expect(Array.isArray(rules["@stylistic/indent"])).toBe(true);
            expect(rules["@stylistic/indent"][0]).toBe("warn");
            expect(rules["@stylistic/indent"][1]).toBe(4);
            expect(rules["@stylistic/linebreak-style"]).toBe("error");
            // @stylistic/quotes: double quotes with avoidEscape
            expect(Array.isArray(rules["@stylistic/quotes"])).toBe(true);
            expect(rules["@stylistic/quotes"][0]).toBe("error");
            expect(rules["@stylistic/quotes"][1]).toBe("double");
        });

        test("should have promise rules", () => {
            const rules = configs.base.rules;
            expect(rules["promise/no-multiple-resolved"]).toBe("error");
            expect(rules["promise/prefer-await-to-callbacks"]).toBe("error");
            expect(rules["promise/prefer-await-to-then"]).toBe("error");
            expect(rules["promise/prefer-catch"]).toBe("error");
        });

        test("should have prefer-reflect rules", () => {
            const rules = configs.base.rules;
            expect(rules["@annangela/prefer-reflect/prefer-reflect"]).toBe("error");
        });

        test("should have prefer-arrow-functions rules", () => {
            const rules = configs.base.rules;
            expect(rules["prefer-arrow-functions/prefer-arrow-functions"]).toBeDefined();
            expect(rules["prefer-arrow-functions/prefer-arrow-functions"][0]).toBe("error");
            expect(rules["prefer-arrow-functions/prefer-arrow-functions"][1].classPropertiesAllowed).toBe(true);
            expect(rules["prefer-arrow-functions/prefer-arrow-functions"][1].disallowPrototype).toBe(true);
        });
    });

    describe("node config rules", () => {
        test("should have node plugin rules", () => {
            const rules = configs.node.rules;
            expect(rules["n/exports-style"]).toEqual(["error", "module.exports"]);
            expect(rules["n/file-extension-in-import"]).toEqual(["error", "always"]);
            expect(rules["n/global-require"]).toBe("error");
            expect(rules["n/no-path-concat"]).toBe("error");
            expect(rules["n/prefer-promises/dns"]).toBe("error");
            expect(rules["n/prefer-promises/fs"]).toBe("error");
            expect(rules["n/prefer-node-protocol"]).toBe("error");
        });

        test("should have security plugin rules", () => {
            const rules = configs.node.rules;
            expect(rules["security/detect-object-injection"]).toBeDefined();
            // eslint-plugin-security rules should have string or array severity values
            const severity = rules["security/detect-object-injection"];
            expect(
                typeof severity === "string" || Array.isArray(severity),
                "security/detect-object-injection should have a valid rule severity",
            ).toBe(true);
        });
    });

    describe("typescript config rules", () => {
        test("should have typescript rules", () => {
            const rules = configs.typescript.rules;
            expect(rules["@typescript-eslint/prefer-nullish-coalescing"]).toBeDefined();
            expect(rules["@typescript-eslint/prefer-nullish-coalescing"][0]).toBe("error");
            expect(rules["@typescript-eslint/prefer-nullish-coalescing"][1].ignoreConditionalTests).toBe(true);
        });

        test("should have restrict-template-expressions rules", () => {
            const rules = configs.typescript.rules;
            expect(rules["@typescript-eslint/restrict-template-expressions"]).toBeDefined();
            expect(rules["@typescript-eslint/restrict-template-expressions"][0]).toBe("error");
            expect(rules["@typescript-eslint/restrict-template-expressions"][1].allowNumber).toBe(true);
        });
    });

    describe("forkedGlobals exports", () => {
        test("should export forkedGlobals", () => {
            expect(forkedGlobals).toBeDefined();
            expect(typeof forkedGlobals).toBe("object");
            expect(typeof forkedGlobals.jquery).toBe("object");
            expect(typeof forkedGlobals.greasemonkey).toBe("object");
            expect(typeof forkedGlobals.mocha).toBe("object");
            // Each should have actual entries
            expect(Object.keys(forkedGlobals.jquery).length).toBeGreaterThan(0);
            expect(Object.keys(forkedGlobals.greasemonkey).length).toBeGreaterThan(0);
            expect(Object.keys(forkedGlobals.mocha).length).toBeGreaterThan(0);
        });

        test("should have jquery globals", () => {
            expect(forkedGlobals.jquery.$).toBe(false);
            expect(forkedGlobals.jquery.jQuery).toBe(false);
        });

        test("should have mocha globals", () => {
            expect(forkedGlobals.mocha.after).toBe(false);
            expect(forkedGlobals.mocha.afterEach).toBe(false);
            expect(forkedGlobals.mocha.before).toBe(false);
            expect(forkedGlobals.mocha.beforeEach).toBe(false);
            expect(forkedGlobals.mocha.describe).toBe(false);
            expect(forkedGlobals.mocha.it).toBe(false);
            expect(forkedGlobals.mocha.mocha).toBe(false);
            expect(forkedGlobals.mocha.run).toBe(false);
            expect(forkedGlobals.mocha.setup).toBe(false);
            expect(forkedGlobals.mocha.specify).toBe(false);
            expect(forkedGlobals.mocha.suite).toBe(false);
            expect(forkedGlobals.mocha.suiteSetup).toBe(false);
            expect(forkedGlobals.mocha.suiteTeardown).toBe(false);
            expect(forkedGlobals.mocha.teardown).toBe(false);
            expect(forkedGlobals.mocha.test).toBe(false);
        });

        test("should have greasemonkey globals", () => {
            expect(forkedGlobals.greasemonkey.cloneInto).toBe(false);
            expect(forkedGlobals.greasemonkey.createObjectIn).toBe(false);
            expect(forkedGlobals.greasemonkey.exportFunction).toBe(false);
            expect(forkedGlobals.greasemonkey.GM).toBe(false);
            expect(forkedGlobals.greasemonkey.unsafeWindow).toBe(false);
        });
    });

    describe("default export", () => {
        test("should have correct default export structure", async () => {
            const module = await import("../src/index.js");
            expect(module.default).toBeDefined();
            expect(module.default.configs).toBe(configs);
            expect(module.default.forkedGlobals).toBe(forkedGlobals);
        });
    });

    describe("config plugins", () => {
        test("base config should have correct plugins with rules", () => {
            const plugins = configs.base.plugins;
            for (const name of ["@annangela/prefer-reflect", "promise", "@eslint-community/eslint-comments", "prefer-arrow-functions"]) {
                expect(plugins[name], `${name} plugin should be defined`).toBeDefined();
                // ESLint plugins are objects with rules
                expect(typeof plugins[name], `${name} plugin should be an object`).toBe("object");
                expect(typeof plugins[name].rules, `${name} plugin should have rules`).toBe("object");
            }
        });

        test("node config should have correct plugins with rules", () => {
            const plugins = configs.node.plugins;
            for (const name of ["n", "security"]) {
                expect(plugins[name], `${name} plugin should be defined`).toBeDefined();
                expect(typeof plugins[name], `${name} plugin should be an object`).toBe("object");
                expect(typeof plugins[name].rules, `${name} plugin should have rules`).toBe("object");
            }
        });

        test("typescript config should have correct plugins with rules", () => {
            const plugins = configs.typescript.plugins;
            expect(plugins["@typescript-eslint"]).toBeDefined();
            expect(typeof plugins["@typescript-eslint"]).toBe("object");
            expect(typeof plugins["@typescript-eslint"].rules).toBe("object");
        });
    });

    describe("config globals", () => {
        test("base config should have builtin and es2024 globals", () => {
            const globals = configs.base.languageOptions.globals;
            expect(globals).toBeDefined();
            // Well-known builtin globals from globals.builtin
            expect(globals.Array).toBe(false);
            expect(globals.Object).toBe(false);
            // Well-known es2024 globals from globals.es2024
            expect(globals.Promise).toBe(false);
            expect(globals.Map).toBe(false);
            expect(globals.Set).toBe(false);
        });

        test("browser config should have browser and jquery globals", () => {
            const globals = configs.browser.languageOptions.globals;
            expect(globals).toBeDefined();
            // Well-known browser globals from globals.browser
            expect(globals.window).toBe(false);
            expect(globals.document).toBe(false);
            // Well-known jquery globals from forkedGlobals.jquery
            expect(globals.$).toBe(false);
            expect(globals.jQuery).toBe(false);
        });

        test("node config should have node and nodeBuiltin globals", () => {
            const globals = configs.node.languageOptions.globals;
            expect(globals).toBeDefined();
            // Well-known node globals from globals.node
            expect(globals.process).toBe(false);
            expect(globals.__dirname).toBe(false);
            // Well-known nodeBuiltin globals from globals.nodeBuiltin
            expect(globals.Buffer).toBe(false);
            expect(globals.console).toBe(false);
        });

        test("mocha config should have mocha globals", () => {
            const globals = configs.mocha.languageOptions.globals;
            expect(globals).toBeDefined();
            // Well-known mocha globals from forkedGlobals.mocha
            expect(globals.describe).toBe(false);
            expect(globals.it).toBe(false);
            expect(globals.before).toBe(false);
            expect(globals.after).toBe(false);
        });
    });
});
