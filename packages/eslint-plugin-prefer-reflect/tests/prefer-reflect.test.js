/**
 * @fileoverview Tests for prefer-reflect rule
 * @author AnnAngela
 */

import { describe, test, expect } from "vitest";
import rule from "../src/rules/prefer-reflect.js";
import plugin, { rules } from "../src/index.js";
import { RuleTester } from "eslint";

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
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Function.prototype.apply", substitute: "Reflect.apply" },
                            },
                        ],
                    },
                    {
                        code: "(function(){}).apply(null, [1, 2])",
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
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Function.prototype.call", substitute: "Reflect.apply" },
                            },
                        ],
                    },
                    {
                        code: "(function(){}).call(null, 1, 2)",
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
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.defineProperty", substitute: "Reflect.defineProperty" },
                            },
                        ],
                    },
                    {
                        code: "Object.defineProperty({}, 'foo', { value: 1 })",
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
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.getOwnPropertyDescriptor", substitute: "Reflect.getOwnPropertyDescriptor" },
                            },
                        ],
                    },
                    {
                        code: "Object.getOwnPropertyDescriptor({}, 'foo')",
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
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.getPrototypeOf", substitute: "Reflect.getPrototypeOf" },
                            },
                        ],
                    },
                    {
                        code: "Object.getPrototypeOf({})",
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
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.setPrototypeOf", substitute: "Reflect.setPrototypeOf" },
                            },
                        ],
                    },
                    {
                        code: "Object.setPrototypeOf({}, Object.prototype)",
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
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.isExtensible", substitute: "Reflect.isExtensible" },
                            },
                        ],
                    },
                    {
                        code: "Object.isExtensible({})",
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
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "Object.preventExtensions", substitute: "Reflect.preventExtensions" },
                            },
                        ],
                    },
                    {
                        code: "Object.preventExtensions({})",
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
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "the delete keyword", substitute: "Reflect.deleteProperty" },
                            },
                        ],
                    },
                    {
                        code: "delete ({}).foo",
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
                        errors: [
                            {
                                messageId: "preferReflect",
                                data: { existing: "the in keyword", substitute: "Reflect.has" },
                            },
                        ],
                    },
                    {
                        code: "foo in {}",
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
    });
});
