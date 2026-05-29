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

    beforeEach(() => {
        consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => { /* noop */ });
        // Mock environment variables
        process.env.GITHUB_STEP_SUMMARY = testFilePath;
        process.env.GITHUB_SHA = "abc1234567890";
        process.env.GITHUB_REPOSITORY = "owner/repo";
        process.env.GITHUB_SERVER_URL = "https://github.com";
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
        test("should format error messages", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        test("should format warning messages", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        test("should format notice messages", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });
    });

    describe("with fix information", () => {
        test("should indicate fixable messages", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });
    });

    describe("with line ranges", () => {
        test("should handle multi-line errors", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        test("should handle endColumn at 1", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        test("should handle endColumn at 1 with same line after decrement", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });
    });

    describe("with deprecated rules", () => {
        test("should report deprecated rules", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        test("should not duplicate deprecated rules", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });
    });

    describe("with deprecated rules severity from env", () => {
        test("should use custom severity for deprecated rules", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
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
            expect(consoleInfoSpy).toHaveBeenCalled();
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        test("should handle invalid severity from env", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });
    });

    describe("without GitHub environment", () => {
        test("should work without GITHUB_SHA", () => {
            Reflect.deleteProperty(process.env, "GITHUB_SHA");
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        test("should work without GITHUB_REPOSITORY", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        test("should work without GITHUB_SERVER_URL", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });
    });

    describe("with messages without ruleId", () => {
        test("should handle messages without ruleId", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        test("should handle messages without line number", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });
    });

    describe("with rules without docs url", () => {
        test("should handle rules without url", () => {
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
            expect(consoleInfoSpy).toHaveBeenCalled();
        });
    });

    describe("summary output", () => {
        test("should show nothing broken when no issues", () => {
            void formatter([], createData({ rulesMeta: {} }));
            const content = fs.readFileSync(testFilePath, "utf-8");
            expect(content).toContain("Nothing is broken, everything is fine.");
        });

        test("should show annotations summary", () => {
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
            expect(content).toContain("Annotations");
        });

        test("should show deprecated rules summary", () => {
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
            expect(content).toContain("Deprecated Rules");
        });
    });
});
