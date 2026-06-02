/**
 * @fileoverview Tests for prefer-reflect rule
 * @author AnnAngela
 */

import { RuleTester } from "eslint";
import { describe, expect, test } from "vitest";
import plugin, { rules } from "../src/index.js";
import rule from "../src/rules/prefer-reflect.js";

const ruleTester = new RuleTester();

describe("plugin index", () => {
    test("should export rules", () => {
        expect(rules).toBeDefined();
        expect(rules["prefer-reflect"]).toBe(rule);
    });

    test("should have default export", () => {
        expect(plugin).toBeDefined();
        expect(plugin.rules).toBe(rules);
    });
});

describe("prefer-reflect", () => {
    describe("valid", () => {
        test("Reflect.apply should be valid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.apply(function(){}, null, 1, 2);",
                    { code: "Reflect.apply(function(){}, null, 1, 2);", options: [{ exceptions: ["apply"] }] },
                    { code: "(function(){}).apply(null, [1, 2]);", options: [{ exceptions: ["apply"] }] },
                    { code: "(function(){}).call(null, 1, 2);", options: [{ exceptions: ["apply"] }] },
                ],
                invalid: [],
            });
        });

        test("Reflect.defineProperty should be valid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.defineProperty({}, 'foo', {value: 1})",
                    { code: "Reflect.defineProperty({}, 'foo', {value: 1})", options: [{ exceptions: ["defineProperty"] }] },
                    { code: "Object.defineProperty({}, 'foo', {value: 1})", options: [{ exceptions: ["defineProperty"] }] },
                ],
                invalid: [],
            });
        });

        test("Reflect.deleteProperty should be valid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.deleteProperty({}, 'foo');",
                    { code: "delete ({}).foo", options: [{ exceptions: ["deleteProperty"] }] },
                ],
                invalid: [],
            });
        });

        test("Reflect.getOwnPropertyDescriptor should be valid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.getOwnPropertyDescriptor({}, 'foo');",
                    { code: "Reflect.getOwnPropertyDescriptor({}, 'foo');", options: [{ exceptions: ["getOwnPropertyDescriptor"] }] },
                    { code: "Object.getOwnPropertyDescriptor({}, 'foo');", options: [{ exceptions: ["getOwnPropertyDescriptor"] }] },
                ],
                invalid: [],
            });
        });

        test("Reflect.getPrototypeOf should be valid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.getPrototypeOf({});",
                    { code: "Reflect.getPrototypeOf({});", options: [{ exceptions: ["getPrototypeOf"] }] },
                    { code: "Object.getPrototypeOf({});", options: [{ exceptions: ["getPrototypeOf"] }] },
                ],
                invalid: [],
            });
        });

        test("Reflect.has should be valid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.has({}, 'foo');",
                    { code: "'foo' in {};", options: [{ exceptions: ["has"] }] },
                ],
                invalid: [],
            });
        });

        test("Reflect.setPrototypeOf should be valid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.setPrototypeOf({}, Object.prototype);",
                    { code: "Reflect.setPrototypeOf({}, Object.prototype);", options: [{ exceptions: ["setPrototypeOf"] }] },
                    { code: "Object.setPrototypeOf({}, Object.prototype);", options: [{ exceptions: ["setPrototypeOf"] }] },
                ],
                invalid: [],
            });
        });

        test("Reflect.isExtensible should be valid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.isExtensible({});",
                    { code: "Reflect.isExtensible({});", options: [{ exceptions: ["isExtensible"] }] },
                    { code: "Object.isExtensible({});", options: [{ exceptions: ["isExtensible"] }] },
                ],
                invalid: [],
            });
        });

        test("Reflect.ownKeys should be valid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.ownKeys({});",
                    { code: "Reflect.ownKeys({});", options: [{ exceptions: ["ownKeys"] }] },
                    { code: "Object.getOwnPropertyNames({});", options: [{ exceptions: ["ownKeys"] }] },
                ],
                invalid: [],
            });
        });

        test("Reflect.preventExtensions should be valid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.preventExtensions({});",
                    { code: "Reflect.preventExtensions({});", options: [{ exceptions: ["preventExtensions"] }] },
                    { code: "Object.preventExtensions({});", options: [{ exceptions: ["preventExtensions"] }] },
                ],
                invalid: [],
            });
        });
    });

    describe("invalid", () => {
        test("Function.prototype.apply should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "(function(){}).apply(null, [1, 2])",
                        output: "Reflect.apply(function(){}, null, [1, 2])",
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Function.prototype.apply", substitute: "Reflect.apply" },
                            },
                        ],
                    },
                    {
                        code: "(function(){}).apply(null, [1, 2])",
                        output: "Reflect.apply(function(){}, null, [1, 2])",
                        options: [{ exceptions: ["defineProperty"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Function.prototype.apply", substitute: "Reflect.apply" },
                            },
                        ],
                    },
                ],
            });
        });

        test("Function.prototype.call should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "(function(){}).call(null, 1, 2)",
                        output: "Reflect.apply(function(){}, null, [1, 2])",
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Function.prototype.call", substitute: "Reflect.apply" },
                            },
                        ],
                    },
                    {
                        code: "(function(){}).call(null, 1, 2)",
                        output: "Reflect.apply(function(){}, null, [1, 2])",
                        options: [{ exceptions: ["defineProperty"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Function.prototype.call", substitute: "Reflect.apply" },
                            },
                        ],
                    },
                ],
            });
        });

        test("Object.defineProperty should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "Object.defineProperty({}, 'foo', { value: 1 })",
                        output: "Reflect.defineProperty({}, 'foo', { value: 1 })",
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.defineProperty", substitute: "Reflect.defineProperty" },
                            },
                        ],
                    },
                    {
                        code: "Object.defineProperty({}, 'foo', { value: 1 })",
                        output: "Reflect.defineProperty({}, 'foo', { value: 1 })",
                        options: [{ exceptions: ["apply"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.defineProperty", substitute: "Reflect.defineProperty" },
                            },
                        ],
                    },
                ],
            });
        });

        test("Object.getOwnPropertyDescriptor should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "Object.getOwnPropertyDescriptor({}, 'foo')",
                        output: "Reflect.getOwnPropertyDescriptor({}, 'foo')",
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.getOwnPropertyDescriptor", substitute: "Reflect.getOwnPropertyDescriptor" },
                            },
                        ],
                    },
                    {
                        code: "Object.getOwnPropertyDescriptor({}, 'foo')",
                        output: "Reflect.getOwnPropertyDescriptor({}, 'foo')",
                        options: [{ exceptions: ["apply"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.getOwnPropertyDescriptor", substitute: "Reflect.getOwnPropertyDescriptor" },
                            },
                        ],
                    },
                ],
            });
        });

        test("Object.getPrototypeOf should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "Object.getPrototypeOf({})",
                        output: "Reflect.getPrototypeOf({})",
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.getPrototypeOf", substitute: "Reflect.getPrototypeOf" },
                            },
                        ],
                    },
                    {
                        code: "Object.getPrototypeOf({})",
                        output: "Reflect.getPrototypeOf({})",
                        options: [{ exceptions: ["apply"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.getPrototypeOf", substitute: "Reflect.getPrototypeOf" },
                            },
                        ],
                    },
                ],
            });
        });

        test("Object.setPrototypeOf should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "Object.setPrototypeOf({}, Object.prototype)",
                        output: "Reflect.setPrototypeOf({}, Object.prototype)",
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.setPrototypeOf", substitute: "Reflect.setPrototypeOf" },
                            },
                        ],
                    },
                    {
                        code: "Object.setPrototypeOf({}, Object.prototype)",
                        output: "Reflect.setPrototypeOf({}, Object.prototype)",
                        options: [{ exceptions: ["apply"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.setPrototypeOf", substitute: "Reflect.setPrototypeOf" },
                            },
                        ],
                    },
                ],
            });
        });

        test("Object.isExtensible should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "Object.isExtensible({})",
                        output: "Reflect.isExtensible({})",
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.isExtensible", substitute: "Reflect.isExtensible" },
                            },
                        ],
                    },
                    {
                        code: "Object.isExtensible({})",
                        output: "Reflect.isExtensible({})",
                        options: [{ exceptions: ["apply"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.isExtensible", substitute: "Reflect.isExtensible" },
                            },
                        ],
                    },
                ],
            });
        });

        test("Object.getOwnPropertyNames should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "Object.getOwnPropertyNames({})",
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.getOwnPropertyNames", substitute: "Reflect.ownKeys" },
                                suggestions: [{
                                    messageId: "preferReflectOwnKeysSuggest",
                                    output: "Reflect.ownKeys({})",
                                }],
                            },
                        ],
                    },
                    {
                        code: "Object.getOwnPropertyNames({})",
                        options: [{ exceptions: ["apply"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.getOwnPropertyNames", substitute: "Reflect.ownKeys" },
                                suggestions: [{
                                    messageId: "preferReflectOwnKeysSuggest",
                                    output: "Reflect.ownKeys({})",
                                }],
                            },
                        ],
                    },
                ],
            });
        });

        test("Object.preventExtensions should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "Object.preventExtensions({})",
                        output: "Reflect.preventExtensions({})",
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.preventExtensions", substitute: "Reflect.preventExtensions" },
                            },
                        ],
                    },
                    {
                        code: "Object.preventExtensions({})",
                        output: "Reflect.preventExtensions({})",
                        options: [{ exceptions: ["apply"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.preventExtensions", substitute: "Reflect.preventExtensions" },
                            },
                        ],
                    },
                ],
            });
        });

        test("delete keyword should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "delete ({}).foo",
                        output: 'Reflect.deleteProperty({}, "foo")',
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "the delete keyword", substitute: "Reflect.deleteProperty" },
                            },
                        ],
                    },
                    {
                        code: "delete ({}).foo",
                        output: 'Reflect.deleteProperty({}, "foo")',
                        options: [{ exceptions: ["apply"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "the delete keyword", substitute: "Reflect.deleteProperty" },
                            },
                        ],
                    },
                ],
            });
        });

        test("in keyword should be invalid", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "foo in {}",
                        output: "Reflect.has({}, foo)",
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "the in keyword", substitute: "Reflect.has" },
                            },
                        ],
                    },
                    {
                        code: "foo in {}",
                        output: "Reflect.has({}, foo)",
                        options: [{ exceptions: ["apply"] }],
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "the in keyword", substitute: "Reflect.has" },
                            },
                        ],
                    },
                ],
            });
        });
    });

    describe("rule metadata", () => {
        test("should have correct meta", () => {
            expect(rule.meta.type).toBe("suggestion");
            expect(rule.meta.fixable).toBe("code");
            expect(rule.meta.docs.description).toBe("Modern version of original `prefer-reflect` rules in eslint");
            expect(rule.meta.docs.recommended).toBe(true);
            expect(rule.meta.messages.preferReflect).toBe("Avoid using {{existing}}, instead use {{substitute}}.");
        });

        test("should have correct schema", () => {
            expect(rule.meta.schema).toHaveLength(1);
            expect(rule.meta.schema[0].type).toBe("object");
            expect(rule.meta.schema[0].properties.exceptions.type).toBe("array");
            expect(rule.meta.schema[0].properties.exceptions.items.enum).toContain("apply");
            expect(rule.meta.schema[0].properties.exceptions.items.enum).toContain("defineProperty");
            expect(rule.meta.schema[0].properties.exceptions.items.enum).toContain("deleteProperty");
            expect(rule.meta.schema[0].properties.exceptions.items.enum).toContain("getOwnPropertyDescriptor");
            expect(rule.meta.schema[0].properties.exceptions.items.enum).toContain("getPrototypeOf");
            expect(rule.meta.schema[0].properties.exceptions.items.enum).toContain("has");
            expect(rule.meta.schema[0].properties.exceptions.items.enum).toContain("isExtensible");
            expect(rule.meta.schema[0].properties.exceptions.items.enum).toContain("ownKeys");
            expect(rule.meta.schema[0].properties.exceptions.items.enum).toContain("preventExtensions");
            expect(rule.meta.schema[0].properties.exceptions.items.enum).toContain("setPrototypeOf");
        });

        test("should have default options", () => {
            expect(rule.meta.defaultOptions).toEqual([{ exceptions: [] }]);
        });
    });

    describe("edge cases", () => {
        test("should handle missing options", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.apply(function(){}, null, 1, 2);",
                ],
                invalid: [
                    {
                        code: "(function(){}).apply(null, [1, 2])",
                        output: "Reflect.apply(function(){}, null, [1, 2])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should handle empty exceptions array", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "(function(){}).apply(null, [1, 2])",
                        output: "Reflect.apply(function(){}, null, [1, 2])",
                        options: [{ exceptions: [] }],
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should handle options without exceptions property", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "(function(){}).apply(null, [1, 2])",
                        output: "Reflect.apply(function(){}, null, [1, 2])",
                        options: [{}],
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should handle Reflect calls without triggering", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [
                    "Reflect.apply(function(){}, null, 1, 2);",
                    "Reflect.defineProperty({}, 'foo', {value: 1})",
                    "Reflect.deleteProperty({}, 'foo');",
                    "Reflect.getOwnPropertyDescriptor({}, 'foo');",
                    "Reflect.getPrototypeOf({});",
                    "Reflect.has({}, 'foo');",
                    "Reflect.setPrototypeOf({}, Object.prototype);",
                    "Reflect.isExtensible({});",
                    "Reflect.ownKeys({});",
                    "Reflect.preventExtensions({});",
                ],
                invalid: [],
            });
        });

        test("should fix call with no arguments", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.call()",
                        output: "Reflect.apply(func, undefined, [])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should fix apply with no arguments", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.apply()",
                        output: "Reflect.apply(func, undefined, [])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should fix apply with single argument (thisArg only)", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.apply(this)",
                        output: "Reflect.apply(func, this, [])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should fix call with single argument (thisArg only)", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.call(this)",
                        output: "Reflect.apply(func, this, [])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should suggest safe restructuring when apply has spread in argsList", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.apply(thisArg, ...rest)",
                        errors: [{
                            messageId: "preferReflect",
                            suggestions: [{
                                messageId: "preferReflectApplySpreadSuggest",
                                output: "Reflect.apply(func, thisArg, ...(rest.length ? rest : [[]]))",
                            }],
                        }],
                    },
                ],
            });
        });

        test("should report without suggestion when apply has non-identifier spread in argsList", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.apply(thisArg, ...getArgs())",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should suggest safe restructuring when apply has spread in argsList with extra args", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.apply(thisArg, ...rest, sideEffect())",
                        errors: [{
                            messageId: "preferReflect",
                            suggestions: [{
                                messageId: "preferReflectApplySpreadSuggest",
                                output: "Reflect.apply(func, thisArg, ...(rest.length ? rest : [[]]), sideEffect())",
                            }],
                        }],
                    },
                ],
            });
        });

        test("should suggest manual restructuring when apply has single spread argument", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.apply(...all)",
                        errors: [{
                            messageId: "preferReflect",
                            suggestions: [{
                                messageId: "preferReflectCallSpreadSuggest",
                                data: { spreadTarget: "all" },
                                output: "Reflect.apply(func, all[0], all.slice(1))",
                            }],
                        }],
                    },
                ],
            });
        });

        test("should report without suggestions when apply has spread at non-identifier argument", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.apply(...getArgs())",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should fix call when tail arguments include spread", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.call(thisArg, head, ...rest)",
                        output: "Reflect.apply(func, thisArg, [head, ...rest])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                    {
                        code: "func.call(thisArg, ...rest)",
                        output: "Reflect.apply(func, thisArg, [...rest])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should suggest manual restructuring when call has spread at thisArg", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.call(...all)",
                        errors: [{
                            messageId: "preferReflect",
                            suggestions: [{
                                messageId: "preferReflectCallSpreadSuggest",
                                data: { spreadTarget: "all" },
                                output: "Reflect.apply(func, all[0], all.slice(1))",
                            }],
                        }],
                    },
                ],
            });
        });

        test("should report without suggestions when call has spread at non-identifier thisArg", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.call(...getArgs())",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should fix delete with computed property", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "delete obj[expr]",
                        output: "Reflect.deleteProperty(obj, expr)",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should fix delete with nested member", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "delete a.b.c",
                        output: 'Reflect.deleteProperty(a.b, "c")',
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should suggest removing delete on non-member expressions", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "delete foo()",
                        errors: [{
                            messageId: "preferReflect",
                            suggestions: [{
                                messageId: "preferReflectDeleteNonMemberSuggest",
                                output: "foo()",
                            }],
                        }],
                    },
                    {
                        code: "delete (a, b)",
                        errors: [{
                            messageId: "preferReflect",
                            suggestions: [{
                                messageId: "preferReflectDeleteNonMemberSuggest",
                                output: "(a, b)",
                            }],
                        }],
                    },
                ],
            });
        });

        test("should fix in with string literal key", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "'foo' in {}",
                        output: "Reflect.has({}, 'foo')",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should preserve sequence expressions when fixing in", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "(a, b) in obj",
                        output: "Reflect.has(obj, (a, b))",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should only report Object static method replacements", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: ["someObj.defineProperty({}, 'foo', { value: 1 })"],
                invalid: [],
            });
        });

        test("should preserve extra apply arguments for side effects", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.apply(thisArg, args, sideEffect())",
                        output: "Reflect.apply(func, thisArg, args, sideEffect())",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should parenthesize sequence expression in call/apply callee", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "(a, b).apply(thisArg, [1])",
                        output: "Reflect.apply((a, b), thisArg, [1])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                    {
                        code: "(a, b).call(thisArg, x)",
                        output: "Reflect.apply((a, b), thisArg, [x])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should parenthesize sequence expression in call/apply arguments", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.apply(thisArg, (a, b))",
                        output: "Reflect.apply(func, thisArg, (a, b))",
                        errors: [{ messageId: "preferReflect" }],
                    },
                    {
                        code: "func.call(thisArg, (a, b))",
                        output: "Reflect.apply(func, thisArg, [(a, b)])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should parenthesize sequence expression in delete object", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "delete (a, b).c",
                        output: 'Reflect.deleteProperty((a, b), "c")',
                        errors: [{ messageId: "preferReflect" }],
                    },
                    {
                        code: "delete obj[(a, b)]",
                        output: "Reflect.deleteProperty(obj, (a, b))",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should parenthesize sequence expression on right side of in", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "'foo' in (a, b)",
                        output: "Reflect.has((a, b), 'foo')",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });

        test("should fix apply with zero arguments", () => {
            ruleTester.run("prefer-reflect", rule, {
                valid: [],
                invalid: [
                    {
                        code: "func.apply()",
                        output: "Reflect.apply(func, undefined, [])",
                        errors: [{ messageId: "preferReflect" }],
                    },
                ],
            });
        });
    });
});
