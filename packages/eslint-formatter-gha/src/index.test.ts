/**
 * @fileoverview Tests for ESLint formatter
 * @author AnnAngela
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import tmp from "tmp";
import type { ESLint } from "eslint";
import formatter from "./index.js";

const createResult = (overrides: Partial<ESLint.LintResult> & { filePath: string }): ESLint.LintResult => ({
    messages: [],
    suppressedMessages: [],
    errorCount: 0,
    fatalErrorCount: 0,
    warningCount: 0,
    fixableErrorCount: 0,
    fixableWarningCount: 0,
    usedDeprecatedRules: [],
    ...overrides,
});

const createData = (overrides: Partial<ESLint.LintResultData> & { rulesMeta: ESLint.LintResultData["rulesMeta"] }): ESLint.LintResultData => ({
    cwd: process.cwd(),
    ...overrides,
});

describe("eslint-formatter-gha", () => {
    let consoleInfoSpy: ReturnType<typeof vi.spyOn<typeof console, "info">>;
    // Create secure temporary file once for all tests (ActionsSummary caches _filePath)
    const tmpFile = tmp.fileSync({ postfix: ".md" });
    const testFilePath = tmpFile.name;
    fs.closeSync(tmpFile.fd);

    /** Helper: get all console.info calls as strings */
    const getCalls = () => consoleInfoSpy.mock.calls.map(c => c[0] as string);

    beforeEach(() => {
        consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => { /* noop */ });
        // Mock environment variables
        process.env.GITHUB_STEP_SUMMARY = testFilePath;
        process.env.GITHUB_SHA = "abc1234567890";
        process.env.GITHUB_REPOSITORY = "owner/repo";
        process.env.GITHUB_SERVER_URL = "https://github.com";
        // Truncate summary file for test isolation
        fs.writeFileSync(testFilePath, "", { flag: "w" });
    });

    afterEach(() => {
        consoleInfoSpy.mockRestore();
        // Clean up environment
        Reflect.deleteProperty(process.env, "GITHUB_STEP_SUMMARY");
        Reflect.deleteProperty(process.env, "GITHUB_SHA");
        Reflect.deleteProperty(process.env, "GITHUB_REPOSITORY");
        Reflect.deleteProperty(process.env, "GITHUB_SERVER_URL");
        Reflect.deleteProperty(process.env, "ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY");
    });

    describe("basic functionality", () => {
        test("should return empty string", () => {
            const result = formatter([], createData({ rulesMeta: {} }));
            expect(result).toBe("");
        });

        test("should handle empty results", () => {
            const result = formatter([], createData({ rulesMeta: {} }));
            expect(result).toBe("");
        });
    });

    describe("with lint messages", () => {
        test("should format error messages with ::error workflow command", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Unexpected var, use let or const instead",
                            severity: 2,
                            line: 10,
                            column: 5,
                            ruleId: "no-var",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "no-var": {
                        docs: {
                            url: "https://eslint.org/docs/rules/no-var",
                        },
                    },
                },
            });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            expect(errorCalls[0]).toContain("title=ESLint Annotation");
            expect(errorCalls[0]).toContain("file=/path/to/file.js");
            expect(errorCalls[0]).toContain("startLine=10,startColumn=5");
            expect(errorCalls[0]).toContain("Unexpected var, use let or const instead");
            expect(errorCalls[0]).toContain("(no-var) - https://eslint.org/docs/rules/no-var");
            expect(errorCalls[0]).toContain(`https://github.com/owner/repo/blob/${process.env.GITHUB_SHA!.slice(0, 7)}/`);
        });

        test("should format warning messages with ::warning workflow command", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Missing semicolon",
                            severity: 1,
                            line: 5,
                            column: 10,
                            ruleId: "semi",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    semi: {
                        docs: {
                            url: "https://eslint.org/docs/rules/semi",
                        },
                    },
                },
            });

            void formatter(results, data);

            const warningCalls = getCalls().filter(c => c.startsWith("::warning"));
            expect(warningCalls.length).toBe(1);
            expect(warningCalls[0]).toContain("title=ESLint Annotation");
            expect(warningCalls[0]).toContain("Missing semicolon");
            expect(warningCalls[0]).toContain("(semi)");
        });

        test("should format notice messages with ::notice workflow command", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Info message",
                            severity: 0,
                            line: 1,
                            column: 1,
                            ruleId: "info-rule",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "info-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/info-rule",
                        },
                    },
                },
            });

            void formatter(results, data);

            const noticeCalls = getCalls().filter(c => c.startsWith("::notice"));
            expect(noticeCalls.length).toBe(1);
            expect(noticeCalls[0]).toContain("Info message");
            expect(noticeCalls[0]).toContain("(info-rule)");
        });
    });

    describe("with fix information", () => {
        test("should indicate fixable messages with [maybe fixable] tag", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Missing semicolon",
                            severity: 2,
                            line: 5,
                            column: 10,
                            ruleId: "semi",
                            fix: { range: [10, 11], text: ";" },
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    semi: {
                        docs: {
                            url: "https://eslint.org/docs/rules/semi",
                        },
                    },
                },
            });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            expect(errorCalls[0]).toContain("[maybe fixable]");
        });
    });

    describe("with line ranges", () => {
        test("should include endLine and endColumn for multi-line errors", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Block comment",
                            severity: 2,
                            line: 1,
                            column: 1,
                            endLine: 5,
                            endColumn: 2,
                            ruleId: "no-inline-comments",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "no-inline-comments": {
                        docs: {
                            url: "https://eslint.org/docs/rules/no-inline-comments",
                        },
                    },
                },
            });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            expect(errorCalls[0]).toContain("endLine=5,endColumn=2");
            expect(errorCalls[0]).toContain("no-inline-comments");
        });

        test("should decrement endLine when endColumn is 1", () => {
            // endColumn=1 means the error ends at the last column of the previous line,
            // so the formatter decrements endLine and uses it for the link hash
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Test error",
                            severity: 2,
                            line: 1,
                            column: 1,
                            endLine: 5,
                            endColumn: 1,
                            ruleId: "test-rule",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "test-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/test-rule",
                        },
                    },
                },
            });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            // Annotation properties use original values
            expect(errorCalls[0]).toContain("endLine=5,endColumn=1");
            // Link hash should use decremented endLine: L1-L4
            expect(errorCalls[0]).toMatch(/#L1-L4/);
        });

        test("should omit endLine from hash when decremented endLine equals startLine", () => {
            // endLine=6, endColumn=1, line=5 → decremented endLine=5 → same as line → no hash suffix
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Test error",
                            severity: 2,
                            line: 5,
                            column: 1,
                            endLine: 6,
                            endColumn: 1,
                            ruleId: "test-rule",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "test-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/test-rule",
                        },
                    },
                },
            });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            // Link should only have single line hash, not a range
            expect(errorCalls[0]).toContain("#L5");
            expect(errorCalls[0]).not.toContain("#L5-L");
        });
    });

    describe("with deprecated rules", () => {
        test("should report deprecated rules with replacement info", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    usedDeprecatedRules: [
                        {
                            ruleId: "old-rule",
                            replacedBy: ["new-rule"],
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "old-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/old-rule",
                        },
                    },
                    "new-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/new-rule",
                        },
                    },
                },
            });

            void formatter(results, data);

            const warningCalls = getCalls().filter(c => c.startsWith("::warning"));
            expect(warningCalls.length).toBe(1);
            // Deprecated rule annotation uses "ESLint Annotation" title without file/line properties
            expect(warningCalls[0]).toContain("title=ESLint Annotation");
            expect(warningCalls[0]).toContain("Deprecated rule: old-rule");
            expect(warningCalls[0]).toContain("replaced by new-rule instead");
            expect(warningCalls[0]).toContain("https://eslint.org/docs/rules/old-rule");
        });

        test("should report deprecated rules without replacement", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    usedDeprecatedRules: [
                        {
                            ruleId: "old-rule",
                            replacedBy: [],
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "old-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/old-rule",
                        },
                    },
                },
            });

            void formatter(results, data);

            const warningCalls = getCalls().filter(c => c.startsWith("::warning"));
            expect(warningCalls.length).toBe(1);
            expect(warningCalls[0]).toContain("Deprecated rule: old-rule");
            // Should NOT contain "replaced by" since replacedBy is empty
            expect(warningCalls[0]).not.toContain("replaced by");
        });

        test("should not output duplicate deprecated rule annotations", () => {
            // Two files using the same deprecated rule → only one annotation
            const results = [
                createResult({
                    filePath: "/path/to/file1.js",
                    usedDeprecatedRules: [
                        { ruleId: "old-rule", replacedBy: [] },
                    ],
                }),
                createResult({
                    filePath: "/path/to/file2.js",
                    usedDeprecatedRules: [
                        { ruleId: "old-rule", replacedBy: [] },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "old-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/old-rule",
                        },
                    },
                },
            });

            void formatter(results, data);

            const warningCalls = getCalls().filter(c => c.startsWith("::warning"));
            // Deprecated rule should only appear once despite two files using it
            expect(warningCalls.length).toBe(1);
        });
    });

    describe("with deprecated rules severity from env", () => {
        test("should use custom notice severity for deprecated rules", () => {
            process.env.ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY = "notice";
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    usedDeprecatedRules: [
                        { ruleId: "old-rule", replacedBy: [] },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "old-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/old-rule",
                        },
                    },
                },
            });

            void formatter(results, data);

            const noticeCalls = getCalls().filter(c => c.startsWith("::notice"));
            expect(noticeCalls.length).toBe(1);
            expect(noticeCalls[0]).toContain("Deprecated rule: old-rule");
        });

        test("should use debug severity for deprecated rules", () => {
            process.env.ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY = "debug";
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    usedDeprecatedRules: [
                        { ruleId: "old-rule", replacedBy: [] },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "old-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/old-rule",
                        },
                    },
                },
            });

            void formatter(results, data);

            // debug severity uses ::debug prefix, not shown as annotation
            const debugCalls = getCalls().filter(c => c.startsWith("::debug"));
            const deprecatedDebugCall = debugCalls.find(c => c.includes("Deprecated rule: old-rule"));
            expect(deprecatedDebugCall).toBeDefined();
            // Should NOT produce ::warning annotation for deprecated rules
            const warningCalls = getCalls().filter(c => c.startsWith("::warning::Deprecated"));
            expect(warningCalls.length).toBe(0);
        });

        test("should use error severity for deprecated rules", () => {
            process.env.ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY = "error";
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    usedDeprecatedRules: [
                        { ruleId: "old-rule", replacedBy: [] },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "old-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/old-rule",
                        },
                    },
                },
            });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            expect(errorCalls[0]).toContain("Deprecated rule: old-rule");
        });

        test("should fall back to warning severity for invalid env value", () => {
            process.env.ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY = "invalid";
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    usedDeprecatedRules: [
                        { ruleId: "old-rule", replacedBy: [] },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "old-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/old-rule",
                        },
                    },
                },
            });

            void formatter(results, data);

            // Should fall back to default "warning" severity
            const warningCalls = getCalls().filter(c => c.startsWith("::warning"));
            const deprecatedWarning = warningCalls.find(c => c.includes("Deprecated rule: old-rule"));
            expect(deprecatedWarning).toBeDefined();
            // Summary should report the invalid env value
            const summaryContent = fs.readFileSync(testFilePath, "utf-8");
            expect(summaryContent).toContain("invalid");
            expect(summaryContent).toContain("warning");
        });
    });

    describe("without GitHub environment", () => {
        test("should output relative file path instead of GitHub link when GITHUB_SHA is missing", () => {
            Reflect.deleteProperty(process.env, "GITHUB_SHA");
            const results = [
                createResult({
                    filePath: "/absolute/path/to/file.js",
                    messages: [
                        {
                            message: "Test error",
                            severity: 2,
                            line: 1,
                            column: 1,
                            ruleId: "test-rule",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "test-rule": {
                        docs: {},
                    },
                },
            });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            // Without GITHUB_SHA, should output relative path prefixed with @
            expect(errorCalls[0]).toContain("@");
            // Should NOT contain a GitHub blob URL
            expect(errorCalls[0]).not.toContain("https://github.com");
        });

        test("should output relative file path when GITHUB_REPOSITORY is missing", () => {
            Reflect.deleteProperty(process.env, "GITHUB_REPOSITORY");
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Test error",
                            severity: 2,
                            line: 1,
                            column: 1,
                            ruleId: "test-rule",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "test-rule": {
                        docs: {},
                    },
                },
            });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            expect(errorCalls[0]).toContain("@");
            expect(errorCalls[0]).not.toContain("https://github.com/owner");
        });

        test("should use default GitHub URL when GITHUB_SERVER_URL is missing", () => {
            Reflect.deleteProperty(process.env, "GITHUB_SERVER_URL");
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Test error",
                            severity: 2,
                            line: 1,
                            column: 1,
                            ruleId: "test-rule",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "test-rule": {
                        docs: {},
                    },
                },
            });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            // Should fall back to default https://github.com
            expect(errorCalls[0]).toContain("https://github.com/owner/repo/blob/");
        });
    });

    describe("with messages without ruleId", () => {
        test("should handle messages without ruleId (e.g., parse errors)", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Parsing error",
                            severity: 2,
                            line: 1,
                            column: 1,
                        },
                    ],
                }),
            ];
            const data = createData({ rulesMeta: {} });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            expect(errorCalls[0]).toContain("Parsing error");
            // Should NOT contain rule link since there's no ruleId
            expect(errorCalls[0]).not.toContain("https://eslint.org");
        });

        test("should handle messages without line number (file-level errors)", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "File-level error",
                            severity: 2,
                        },
                    ],
                }),
            ];
            const data = createData({ rulesMeta: {} });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            expect(errorCalls[0]).toContain("File-level error");
            // When line/column are undefined, they appear as "undefined" in annotation properties
            expect(errorCalls[0]).toContain("startLine=undefined");
            expect(errorCalls[0]).toContain("startColumn=undefined");
        });
    });

    describe("with rules without docs url", () => {
        test("should handle rules without docs URL by using ruleId as fallback", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Test error",
                            severity: 2,
                            line: 1,
                            column: 1,
                            ruleId: "test-rule",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "test-rule": {},
                },
            });

            void formatter(results, data);

            const errorCalls = getCalls().filter(c => c.startsWith("::error"));
            expect(errorCalls.length).toBe(1);
            expect(errorCalls[0]).toContain("(test-rule)");
            // Should use ruleId as text (no URL), so there should be "test-rule" after the closing paren
            expect(errorCalls[0]).toContain("(test-rule) - test-rule");
        });
    });

    describe("summary output", () => {
        test("should write 'Nothing is broken' when no issues exist", () => {
            void formatter([], createData({ rulesMeta: {} }));
            const content = fs.readFileSync(testFilePath, "utf-8");
            expect(content).toContain("Nothing is broken, everything is fine.");
            // Should NOT have Annotations or Deprecated Rules headings
            expect(content).not.toContain("## Annotations");
            expect(content).not.toContain("## Deprecated Rules");
        });

        test("should include annotations heading and rule details in summary", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    messages: [
                        {
                            message: "Test error",
                            severity: 2,
                            line: 1,
                            column: 1,
                            ruleId: "test-rule",
                        },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "test-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/test-rule",
                        },
                    },
                },
            });

            void formatter(results, data);
            const content = fs.readFileSync(testFilePath, "utf-8");
            expect(content).toContain("## Annotations");
            expect(content).toContain("Test error");
            expect(content).toContain("test-rule");
        });

        test("should include deprecated rules heading and rule details in summary", () => {
            const results = [
                createResult({
                    filePath: "/path/to/file.js",
                    usedDeprecatedRules: [
                        { ruleId: "old-rule", replacedBy: [] },
                    ],
                }),
            ];
            const data = createData({
                rulesMeta: {
                    "old-rule": {
                        docs: {
                            url: "https://eslint.org/docs/rules/old-rule",
                        },
                    },
                },
            });

            void formatter(results, data);
            const content = fs.readFileSync(testFilePath, "utf-8");
            expect(content).toMatch(/#+ :warning: Deprecated Rules/);
            expect(content).toContain("old-rule");
            // Should NOT have Annotations heading
            expect(content).not.toContain("## Annotations");
        });
    });
});
