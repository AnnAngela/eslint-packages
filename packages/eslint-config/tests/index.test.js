/**
 * @fileoverview Tests for eslint-config package
 * @author AnnAngela
 */

import { describe, test, expect } from "vitest";
import rootPackageJSON from "../../../package.json" with { type: "json" };
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
            expect(rules["@stylistic/indent"]).toBeDefined();
            expect(rules["@stylistic/linebreak-style"]).toBe("error");
            expect(rules["@stylistic/quotes"]).toBeDefined();
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
            expect(rules["n/no-unsupported-features/node-builtins"]).toEqual(["error", { version: rootPackageJSON.engines.node }]);
            expect(rules["n/no-unsupported-features/es-builtins"]).toEqual(["error", { version: rootPackageJSON.engines.node }]);
            expect(rules["n/no-unsupported-features/es-syntax"]).toEqual(["error", { version: rootPackageJSON.engines.node }]);
            expect(rules["n/prefer-promises/dns"]).toBe("error");
            expect(rules["n/prefer-promises/fs"]).toBe("error");
            expect(rules["n/prefer-node-protocol"]).toBe("error");
        });

        test("should have security plugin rules", () => {
            const rules = configs.node.rules;
            expect(rules["security/detect-object-injection"]).toBeDefined();
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
            expect(forkedGlobals.jquery).toBeDefined();
            expect(forkedGlobals.greasemonkey).toBeDefined();
            expect(forkedGlobals.mocha).toBeDefined();
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
        test("base config should have correct plugins", () => {
            const plugins = configs.base.plugins;
            expect(plugins["@annangela/prefer-reflect"]).toBeDefined();
            expect(plugins.promise).toBeDefined();
            expect(plugins["@eslint-community/eslint-comments"]).toBeDefined();
            expect(plugins["prefer-arrow-functions"]).toBeDefined();
        });

        test("node config should have correct plugins", () => {
            const plugins = configs.node.plugins;
            expect(plugins.n).toBeDefined();
            expect(plugins.security).toBeDefined();
        });

        test("typescript config should have correct plugins", () => {
            const plugins = configs.typescript.plugins;
            expect(plugins["@typescript-eslint"]).toBeDefined();
        });
    });

    describe("config globals", () => {
        test("base config should have builtin and es2024 globals", () => {
            const globals = configs.base.languageOptions.globals;
            expect(globals).toBeDefined();
            expect(typeof globals).toBe("object");
        });

        test("browser config should have browser and jquery globals", () => {
            const globals = configs.browser.languageOptions.globals;
            expect(globals).toBeDefined();
            expect(typeof globals).toBe("object");
        });

        test("node config should have node and nodeBuiltin globals", () => {
            const globals = configs.node.languageOptions.globals;
            expect(globals).toBeDefined();
            expect(typeof globals).toBe("object");
        });

        test("mocha config should have mocha globals", () => {
            const globals = configs.mocha.languageOptions.globals;
            expect(globals).toBeDefined();
            expect(typeof globals).toBe("object");
        });
    });
});
