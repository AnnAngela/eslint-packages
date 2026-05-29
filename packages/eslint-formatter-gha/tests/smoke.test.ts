import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ESLint } from "eslint";
import { fileSync } from "tmp";

describe("eslint-formatter-gha smoke tests", () => {
    const originalEnv = process.env;
    let summaryFile: string;

    beforeEach(() => {
        const tmpFile = fileSync({ postfix: ".md" });
        summaryFile = tmpFile.name;
        vi.stubEnv("GITHUB_STEP_SUMMARY", summaryFile);
        vi.stubEnv("GITHUB_SHA", "abc123");
        vi.stubEnv("GITHUB_REPOSITORY", "owner/repo");
        vi.stubEnv("GITHUB_SERVER_URL", "https://github.com");
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("should load formatter and format lint results", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: {
                rules: {
                    "no-unused-vars": "error",
                },
            },
        });

        const results = await eslint.lintText("const x = 1;\n");
        const formatter = await eslint.loadFormatter(
            "@annangela/eslint-formatter-gha",
        );
        const formatted = formatter.format(results);

        expect(typeof formatted).toBe("string");
    });

    it("should handle empty results", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: {
                rules: {},
            },
        });

        const results = await eslint.lintText("const x = 1;\n");
        const formatter = await eslint.loadFormatter(
            "@annangela/eslint-formatter-gha",
        );
        const formatted = formatter.format(results);

        expect(typeof formatted).toBe("string");
    });
});
