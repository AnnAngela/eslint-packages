import { describe, it, expect } from "vitest";
import { ESLint } from "eslint";
import plugin from "../src/index.js";

describe("eslint-plugin-prefer-reflect smoke tests", () => {
    it("should load plugin and lint code with prefer-reflect rule", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: {
                plugins: {
                    "@annangela/prefer-reflect": plugin,
                },
                rules: {
                    "@annangela/prefer-reflect/prefer-reflect": "error",
                },
            },
        });

        const results = await eslint.lintText(
            "Reflect.apply(fn, thisArg, []);\n",
        );

        expect(results).toHaveLength(1);
        expect(results[0].messages).toBeDefined();
    });

    it("should detect violations when using legacy APIs", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: {
                plugins: {
                    "@annangela/prefer-reflect": plugin,
                },
                rules: {
                    "@annangela/prefer-reflect/prefer-reflect": "error",
                },
            },
        });

        const results = await eslint.lintText(
            "fn.apply(thisArg, []);\n",
        );

        expect(results).toHaveLength(1);
        expect(results[0].messages.length).toBeGreaterThan(0);
        expect(results[0].messages[0].ruleId).toBe(
            "@annangela/prefer-reflect/prefer-reflect",
        );
    });

    it("should export plugin with rules", () => {
        expect(plugin.rules).toBeDefined();
        expect(plugin.rules["prefer-reflect"]).toBeDefined();
    });

    it("should support exceptions option", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: {
                plugins: {
                    "@annangela/prefer-reflect": plugin,
                },
                rules: {
                    "@annangela/prefer-reflect/prefer-reflect": [
                        "error",
                        { exceptions: ["apply"] },
                    ],
                },
            },
        });

        const results = await eslint.lintText(
            "fn.apply(thisArg, []);\n",
        );

        expect(results).toHaveLength(1);
        // With "apply" in exceptions, there should be no violation
        const applyErrors = results[0].messages.filter(
            (m) => m.ruleId === "@annangela/prefer-reflect/prefer-reflect",
        );
        expect(applyErrors).toHaveLength(0);
    });
});
