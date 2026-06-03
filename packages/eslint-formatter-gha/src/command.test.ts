/**
 * @fileoverview Tests for command utilities
 * @author AnnAngela
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { log, eslintSeverityToAnnotationSeverity, type logSeverity } from "./command.js";

describe("command", () => {
    let consoleInfoSpy: ReturnType<typeof vi.spyOn<typeof console, "info">>;

    beforeEach(() => {
        consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => { /* noop */ });
    });

    afterEach(() => {
        consoleInfoSpy.mockRestore();
    });

    describe("eslintSeverityToAnnotationSeverity", () => {
        test("should map severity 0 to notice", () => {
            expect(eslintSeverityToAnnotationSeverity[0]).toBe("notice");
        });

        test("should map severity 1 to warning", () => {
            expect(eslintSeverityToAnnotationSeverity[1]).toBe("warning");
        });

        test("should map severity 2 to error", () => {
            expect(eslintSeverityToAnnotationSeverity[2]).toBe("error");
        });
    });

    describe("log", () => {
        test("should log debug message", () => {
            log("debug", "test message");
            expect(consoleInfoSpy).toHaveBeenCalledWith("::debug::test message");
        });

        test("should log notice message", () => {
            log("notice", "test message");
            expect(consoleInfoSpy).toHaveBeenCalledWith("::notice::test message");
        });

        test("should log warning message", () => {
            log("warning", "test message");
            expect(consoleInfoSpy).toHaveBeenCalledWith("::warning::test message");
        });

        test("should log error message", () => {
            log("error", "test message");
            expect(consoleInfoSpy).toHaveBeenCalledWith("::error::test message");
        });

        test("should log with annotation properties", () => {
            log("error", "test message", {
                title: "ESLint Annotation",
                file: "test.js",
                startLine: 1,
                startColumn: 5,
            });
            expect(consoleInfoSpy).toHaveBeenCalledWith(
                "::error title=ESLint Annotation,file=test.js,startLine=1,startColumn=5::test message",
            );
        });

        test("should escape special characters in message", () => {
            log("error", "test%message\r\nwith:special,characters");
            expect(consoleInfoSpy).toHaveBeenCalledWith(
                "::error::test%25message%0D%0Awith:special,characters",
            );
        });

        test("should escape special characters in properties", () => {
            log("error", "test", {
                title: "test%title",
                file: "test\rfile",
            });
            expect(consoleInfoSpy).toHaveBeenCalledWith(
                "::error title=test%25title,file=test%0Dfile::test",
            );
        });

        test("should handle numeric values in properties", () => {
            log("error", "test", {
                startLine: 1,
                startColumn: 5,
            });
            expect(consoleInfoSpy).toHaveBeenCalledWith(
                "::error startLine=1,startColumn=5::test",
            );
        });

        test("should handle all severity types", () => {
            const severities: logSeverity[] = ["debug", "notice", "warning", "error"];
            const expectedPrefixes: Record<logSeverity, string> = {
                debug: "::debug::",
                notice: "::notice::",
                warning: "::warning::",
                error: "::error::",
            };
            for (const severity of severities) {
                consoleInfoSpy.mockClear();
                log(severity, "test");
                expect(consoleInfoSpy).toHaveBeenCalledWith(`${expectedPrefixes[severity]}test`);
            }
        });

        test("should handle empty message", () => {
            log("error", "");
            expect(consoleInfoSpy).toHaveBeenCalledWith("::error::");
        });

        test("should handle message with multiple special characters", () => {
            log("error", "line1\r\nline2\r\nline3");
            expect(consoleInfoSpy).toHaveBeenCalledWith(
                "::error::line1%0D%0Aline2%0D%0Aline3",
            );
        });
    });
});
