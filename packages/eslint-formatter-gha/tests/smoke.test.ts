import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { ESLint } from "eslint";
import fs from "node:fs";
import { fileSync } from "tmp";

describe("eslint-formatter-gha smoke tests", () => {
    let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
    // Use a single tmp file because ActionsSummary lazily caches _filePath
    // and reuses it across all formatter.format() calls within the same process
    const tmpFile = fileSync({ postfix: ".md" });
    const summaryFile = tmpFile.name;
    fs.closeSync(tmpFile.fd);

    beforeAll(() => {
        // Ensure file exists so ActionsSummary can accessSync it
        fs.writeFileSync(summaryFile, "", { flag: "w" });
    });

    afterAll(() => {
        tmpFile.removeCallback();
    });

    beforeEach(() => {
        // Truncate summary file for isolation between tests
        fs.writeFileSync(summaryFile, "", { flag: "w" });
        consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => { /* prevent workflow command leakage to GitHub Actions stdout */ });
        vi.stubEnv("GITHUB_STEP_SUMMARY", summaryFile);
        vi.stubEnv("GITHUB_SHA", "abc123");
        vi.stubEnv("GITHUB_REPOSITORY", "owner/repo");
        vi.stubEnv("GITHUB_SERVER_URL", "https://github.com");
    });

    afterEach(() => {
        consoleInfoSpy.mockRestore();
        vi.unstubAllEnvs();
    });

    it("should output error and debug workflow commands for lint errors", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: {
                rules: {
                    "no-unused-vars": "error",
                },
            },
        });

        const results = await eslint.lintText("const x = 1;\n");
        const formatter = await eslint.loadFormatter("@annangela/eslint-formatter-gha");
        const formatted = formatter.format(results);

        // Formatter returns empty string (output goes via console.info + summary file)
        expect(formatted).toBe("");

        const calls = consoleInfoSpy.mock.calls.map(call => call[0] as string);

        // Should have ::debug call with structured annotation details
        const debugCall = calls.find(c => c.startsWith("::debug::"));
        expect(debugCall).toBeDefined();
        expect(debugCall).toContain("ESLint Annotation");
        expect(debugCall).toContain("no-unused-vars");
        expect(debugCall).toContain('"file": "<text>"');
        expect(debugCall).toContain('"startLine": 1');
        expect(debugCall).toContain('"startColumn": 7');
        expect(debugCall).toContain('"endLine": 1');
        expect(debugCall).toContain('"endColumn": 8');

        // Should have ::error workflow command with correct annotation properties
        const errorCall = calls.find(c => c.startsWith("::error"));
        expect(errorCall).toBeDefined();
        // Annotation properties (comma-separated, order: title,file,startLine,startColumn,endLine,endColumn)
        expect(errorCall).toContain("title=ESLint Annotation");
        expect(errorCall).toContain("file=<text>");
        expect(errorCall).toContain("startLine=1,startColumn=7");
        expect(errorCall).toContain("endLine=1,endColumn=8");
        // Message content (after ::)
        expect(errorCall).toContain("is assigned a value but never used");
        expect(errorCall).toContain("(no-unused-vars)");
        expect(errorCall).toContain("https://eslint.org/docs/latest/rules/no-unused-vars");
        // File link
        expect(errorCall).toContain("https://github.com/owner/repo/blob/abc123/");

        // Summary file should contain annotation details
        const summaryContent = fs.readFileSync(summaryFile, "utf-8");
        expect(summaryContent).toContain("# ESLint Annotation");
        expect(summaryContent).toContain("Annotations");
        expect(summaryContent).toContain("no-unused-vars");
    });

    it("should not output annotation workflow commands for clean code", async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: {
                rules: {},
            },
        });

        const results = await eslint.lintText("const x = 1;\n");
        const formatter = await eslint.loadFormatter("@annangela/eslint-formatter-gha");
        const formatted = formatter.format(results);

        expect(formatted).toBe("");

        // Verify no ::error, ::warning, or ::notice workflow commands were emitted
        const calls = consoleInfoSpy.mock.calls.map(call => call[0] as string);
        const annotationCalls = calls.filter(c =>
            /^::(error|warning|notice)/.test(c)
        );
        expect(annotationCalls).toHaveLength(0);

        // Summary file should indicate no issues
        const summaryContent = fs.readFileSync(summaryFile, "utf-8");
        expect(summaryContent).toContain("Nothing is broken, everything is fine.");
    });
});
