/**
 * @fileoverview Tests for ActionsSummary class
 * @author AnnAngela
 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import tmp from "tmp";
import ActionsSummary from "./ActionsSummary.js";

describe("ActionsSummary", () => {
    let summary: InstanceType<typeof ActionsSummary>;
    let testFilePath: string;

    beforeEach(() => {
        summary = new ActionsSummary();
        // Create secure temporary file
        const tmpFile = tmp.fileSync({ postfix: ".md" });
        testFilePath = tmpFile.name;
        // Close the file descriptor so other processes can write to it
        fs.closeSync(tmpFile.fd);
        // Mock the environment variable
        process.env.GITHUB_STEP_SUMMARY = testFilePath;
    });

    afterEach(() => {
        // Clean up
        Reflect.deleteProperty(process.env, "GITHUB_STEP_SUMMARY");
    });

    describe("static properties", () => {
        test("SUMMARY_ENV_VAR should be correct", () => {
            expect(ActionsSummary.SUMMARY_ENV_VAR).toBe("GITHUB_STEP_SUMMARY");
        });

        test("INTEGER_REGEX should match positive integers", () => {
            expect(ActionsSummary.INTEGER_REGEX.test("1")).toBe(true);
            expect(ActionsSummary.INTEGER_REGEX.test("123")).toBe(true);
            expect(ActionsSummary.INTEGER_REGEX.test("0")).toBe(false);
            expect(ActionsSummary.INTEGER_REGEX.test("-1")).toBe(false);
            expect(ActionsSummary.INTEGER_REGEX.test("abc")).toBe(false);
        });

        test("EMOJI should have correct values", () => {
            expect(ActionsSummary.EMOJI.debug).toBe(":information_source:");
            expect(ActionsSummary.EMOJI.notice).toBe(":information_source:");
            expect(ActionsSummary.EMOJI.warning).toBe(":warning:");
            expect(ActionsSummary.EMOJI.error).toBe(":no_entry:");
            expect(ActionsSummary.EMOJI.fixable).toBe(":wrench:");
        });
    });

    describe("addRaw", () => {
        test("should add raw line to summary", () => {
            const result = summary.addRaw("test line");
            expect(result).toBe(summary);
            expect(summary.stringify()).toContain("test line");
        });

        test("should add multiple lines", () => {
            summary.addRaw("line 1");
            summary.addRaw("line 2");
            const output = summary.stringify();
            expect(output).toContain("line 1");
            expect(output).toContain("line 2");
        });
    });

    describe("addEOL", () => {
        test("should add empty line", () => {
            summary.addEOL();
            expect(summary.isEmptyBuffer()).toBe(false);
            // EOL should add an empty string to the buffer
            const output = summary.stringify();
            // After addEOL, the buffer contains [""] which stringifies to an empty line
            expect(output).toBe("");
        });
    });

    describe("addCodeBlock", () => {
        test("should add code block without language", () => {
            const result = summary.addCodeBlock({ code: "const x = 1;" });
            expect(result).toBe(summary);
            const output = summary.stringify();
            expect(output).toContain("```");
            expect(output).toContain("const x = 1;");
        });

        test("should add code block with language", () => {
            summary.addCodeBlock({ code: "const x = 1;", lang: "javascript" });
            const output = summary.stringify();
            expect(output).toContain("```javascript");
            expect(output).toContain("const x = 1;");
        });
    });

    describe("addList", () => {
        test("should add unordered list", () => {
            const result = summary.addList({ items: ["item 1", "item 2"] });
            expect(result).toBe(summary);
            const output = summary.stringify();
            expect(output).toContain("- item 1");
            expect(output).toContain("- item 2");
        });

        test("should add ordered list", () => {
            summary.addList({ items: ["item 1", "item 2"], ordered: true });
            const output = summary.stringify();
            expect(output).toContain("0. item 1");
            expect(output).toContain("1. item 2");
        });

        test("should add ordered list with custom start", () => {
            summary.addList({ items: ["item 1", "item 2"], ordered: true, start: 5 });
            const output = summary.stringify();
            expect(output).toContain("5. item 1");
            expect(output).toContain("6. item 2");
        });
    });

    describe("addDetails", () => {
        test("should add details element", () => {
            const result = summary.addDetails({ label: "Click me", content: "Hidden content" });
            expect(result).toBe(summary);
            const output = summary.stringify();
            expect(output).toContain("<details>");
            expect(output).toContain("<summary>Click me</summary>");
            expect(output).toContain("Hidden content");
            expect(output).toContain("</details>");
        });
    });

    describe("addImage", () => {
        test("should add image with src only", () => {
            const result = summary.addImage({ src: "https://example.com/image.png" });
            expect(result).toBe(summary);
            const output = summary.stringify();
            expect(output).toContain("<img src=\"https://example.com/image.png\">");
            expect(output).toContain("[<img");
        });

        test("should add image with alt", () => {
            summary.addImage({ src: "https://example.com/image.png", alt: "Test image" });
            const output = summary.stringify();
            expect(output).toContain("alt=\"Test image\"");
        });

        test("should add image with dimensions", () => {
            summary.addImage({ src: "https://example.com/image.png", width: 100, height: 200 });
            const output = summary.stringify();
            expect(output).toContain("width=\"100\"");
            expect(output).toContain("height=\"200\"");
        });

        test("should add image with link", () => {
            summary.addImage({ src: "https://example.com/image.png", link: "https://example.com" });
            const output = summary.stringify();
            expect(output).toContain("https://example.com");
        });

        test("should not add invalid dimensions", () => {
            summary.addImage({ src: "https://example.com/image.png", width: 0, height: -1 });
            const output = summary.stringify();
            expect(output).not.toContain("width=\"0\"");
            expect(output).not.toContain("height=\"-1\"");
        });
    });

    describe("addHeading", () => {
        test("should add heading with default level", () => {
            const result = summary.addHeading({ text: "Test Heading" });
            expect(result).toBe(summary);
            const output = summary.stringify();
            expect(output).toContain("# Test Heading");
        });

        test("should add heading with custom level", () => {
            summary.addHeading({ text: "Test Heading", level: 2 });
            const output = summary.stringify();
            expect(output).toContain("## Test Heading");
        });

        test("should add heading with level 3", () => {
            summary.addHeading({ text: "Test Heading", level: 3 });
            const output = summary.stringify();
            expect(output).toContain("### Test Heading");
        });
    });

    describe("addSeparator", () => {
        test("should add separator", () => {
            const result = summary.addSeparator();
            expect(result).toBe(summary);
            const output = summary.stringify();
            expect(output).toContain("*******");
        });

        test("should provide addSeperator as deprecated alias", () => {
            summary.emptyBuffer();
            // eslint-disable-next-line @typescript-eslint/no-deprecated -- Intentionally testing the deprecated alias
            const result = summary.addSeperator();
            expect(result).toBe(summary);
            const output = summary.stringify();
            expect(output).toContain("*******");
        });
    });

    describe("addQuote", () => {
        test("should add quote without cite", () => {
            const result = summary.addQuote({ text: "This is a quote" });
            expect(result).toBe(summary);
            const output = summary.stringify();
            expect(output).toContain("<blockquote>");
            expect(output).toContain("This is a quote");
            expect(output).toContain("</blockquote>");
        });

        test("should add quote with cite", () => {
            summary.addQuote({ text: "This is a quote", cite: "https://example.com" });
            const output = summary.stringify();
            expect(output).toContain("cite=\"https://example.com\"");
        });
    });

    describe("addLink", () => {
        test("should add link", () => {
            const result = summary.addLink({ text: "Click here", href: "https://example.com" });
            expect(result).toBe(summary);
            const output = summary.stringify();
            expect(output).toContain("[Click here](https://example.com)");
        });
    });

    describe("wrapLink", () => {
        test("should wrap link", () => {
            const result = summary.wrapLink({ text: "Click here", href: "https://example.com" });
            expect(result).toBe("[Click here](https://example.com)");
        });
    });

    describe("wrapImage", () => {
        test("should wrap image with src only", () => {
            const result = summary.wrapImage({ src: "https://example.com/image.png" });
            expect(result).toContain("<img src=\"https://example.com/image.png\">");
        });

        test("should wrap image with all options", () => {
            const result = summary.wrapImage({
                src: "https://example.com/image.png",
                alt: "Test",
                width: 100,
                height: 200,
            });
            expect(result).toContain("src=\"https://example.com/image.png\"");
            expect(result).toContain("alt=\"Test\"");
            expect(result).toContain("width=\"100\"");
            expect(result).toContain("height=\"200\"");
        });

        test("should handle undefined attributes", () => {
            const result = summary.wrapImage({
                src: "https://example.com/image.png",
                alt: undefined,
                width: undefined,
                height: undefined,
            });
            expect(result).toContain("<img src=\"https://example.com/image.png\">");
            expect(result).not.toContain("alt");
            expect(result).not.toContain("width");
            expect(result).not.toContain("height");
        });
    });

    describe("wrapList", () => {
        test("should wrap unordered list", () => {
            const result = summary.wrapList({ items: ["item 1", "item 2"] });
            expect(result).toContain("- item 1");
            expect(result).toContain("- item 2");
        });

        test("should wrap ordered list", () => {
            const result = summary.wrapList({ items: ["item 1", "item 2"], ordered: true });
            expect(result).toContain("0. item 1");
            expect(result).toContain("1. item 2");
        });
    });

    describe("stringify", () => {
        test("should stringify empty summary", () => {
            expect(summary.stringify()).toBe("");
        });

        test("should stringify with content", () => {
            summary.addRaw("test");
            const result = summary.stringify();
            expect(result).toContain("test");
        });
    });

    describe("isEmptyBuffer", () => {
        test("should return true for empty buffer", () => {
            expect(summary.isEmptyBuffer()).toBe(true);
        });

        test("should return false for non-empty buffer", () => {
            summary.addRaw("test");
            expect(summary.isEmptyBuffer()).toBe(false);
        });
    });

    describe("emptyBuffer", () => {
        test("should empty the buffer", () => {
            summary.addRaw("test");
            expect(summary.isEmptyBuffer()).toBe(false);
            const result = summary.emptyBuffer();
            expect(result).toBe(summary);
            expect(summary.isEmptyBuffer()).toBe(true);
        });
    });

    describe("clear", () => {
        test("should clear the buffer and overwrite file with empty content", () => {
            // First write some content that should be cleared
            summary.addRaw("test");
            summary.write();
            // Now clear — empties buffer then overwrites file with empty content
            const result = summary.clear();
            expect(result).toBe(summary);
            expect(summary.isEmptyBuffer()).toBe(true);
            // clear() overwrites the file with empty content, so "test" should be gone
            const fileContent = fs.readFileSync(testFilePath, "utf-8");
            expect(fileContent).toBe("");
        });
    });

    describe("write", () => {
        test("should append to file by default", () => {
            summary.addRaw("test content");
            summary.write();
            const content = fs.readFileSync(testFilePath, "utf-8");
            expect(content).toContain("test content");
        });

        test("should overwrite file when specified", () => {
            summary.addRaw("first write");
            summary.write();
            summary.emptyBuffer();
            summary.addRaw("second write");
            summary.write({ overwrite: true });
            const content = fs.readFileSync(testFilePath, "utf-8");
            expect(content).toContain("second write");
            expect(content).not.toContain("first write");
        });
    });

    describe("error handling", () => {
        test("should throw error when GITHUB_STEP_SUMMARY is not set", () => {
            Reflect.deleteProperty(process.env, "GITHUB_STEP_SUMMARY");
            const newSummary = new ActionsSummary();
            newSummary.addRaw("test");
            expect(() => newSummary.write()).toThrow("Unable to find environment variable");
        });

        test("should throw error when file is not accessible", () => {
            process.env.GITHUB_STEP_SUMMARY = "/nonexistent/path/summary.md";
            const newSummary = new ActionsSummary();
            newSummary.addRaw("test");
            expect(() => newSummary.write()).toThrow("Unable to access summary file");
        });
    });
});
