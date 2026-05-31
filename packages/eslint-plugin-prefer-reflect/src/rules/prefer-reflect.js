/* eslint-disable security/detect-object-injection */
/**
 * @fileoverview Modern version of original "prefer-reflect" rules in eslint
 * @author AnnAngela
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 * @type { import('eslint').Rule.RuleMetaData }
 */
export const meta = {
    type: "suggestion",
    fixable: "code",

    docs: {
        description: "Modern version of original `prefer-reflect` rules in eslint",
        recommended: true,
        url: "https://github.com/AnnAngela/eslint-packages/tree/master/packages/eslint-plugin-prefer-reflect/docs/rules/prefer-reflect.md",
    },

    schema: [
        {
            type: "object",
            properties: {
                exceptions: {
                    type: "array",
                    items: {
                        "enum": [
                            "apply",
                            "defineProperty",
                            "deleteProperty",
                            "getOwnPropertyDescriptor",
                            "getPrototypeOf",
                            "has",
                            "isExtensible",
                            "ownKeys",
                            "preventExtensions",
                            "setPrototypeOf",
                        ],
                    },
                    uniqueItems: true,
                    description: "Execptions",
                },
            },
            additionalProperties: false,
            description: "Options",
        },
    ],
    defaultOptions: [
        {
            exceptions: [],
        },
    ],

    messages: {
        preferReflect: "Avoid using {{existing}}, instead use {{substitute}}.",
    },
};

/**
 * @param { import('eslint').Rule.RuleContext } context
 */
export const create = (context) => {
    const existingNames = {
        apply: "Function.prototype.apply",
        call: "Function.prototype.call",
        defineProperty: "Object.defineProperty",
        getOwnPropertyDescriptor: "Object.getOwnPropertyDescriptor",
        getPrototypeOf: "Object.getPrototypeOf",
        isExtensible: "Object.isExtensible",
        getOwnPropertyNames: "Object.getOwnPropertyNames",
        preventExtensions: "Object.preventExtensions",
        setPrototypeOf: "Object.setPrototypeOf",
    };

    const reflectSubstitutes = {
        apply: "apply",
        call: "apply",
        defineProperty: "defineProperty",
        getOwnPropertyDescriptor: "getOwnPropertyDescriptor",
        getPrototypeOf: "getPrototypeOf",
        isExtensible: "isExtensible",
        getOwnPropertyNames: "ownKeys",
        preventExtensions: "preventExtensions",
        setPrototypeOf: "setPrototypeOf",
    };

    const exceptions = context.options[0].exceptions;
    const sourceCode = context.sourceCode;
    const getText = (node) => sourceCode.getText(node);

    /**
     * Reports the Reflect violation based on the `existing` and `substitute`
     * @param {Object} node The node that violates the rule.
     * @param {string} existing The existing method name that has been used.
     * @param {string} substitute The Reflect substitute that should be used.
     * @param {import('eslint').Rule.RuleFixer} fix The fix function.
     * @returns {void}
     */
    const report = (node, existing, substitute, fix) => {
        context.report({
            node,
            messageId: "preferReflect",
            data: {
                existing,
                substitute,
            },
            fix,
        });
    };

    return {
        CallExpression: (node) => {
            const methodName = node.callee.property?.name;
            const isReflectCall = node.callee.object?.name === "Reflect";
            const hasReflectSubstitute = typeof reflectSubstitutes[methodName] === "string";
            const userConfiguredException = exceptions.includes(reflectSubstitutes[methodName]);
            const requiresObjectCallee = methodName !== "apply" && methodName !== "call";
            const isObjectCallee = node.callee.object?.type === "Identifier" && node.callee.object.name === "Object";

            if (hasReflectSubstitute && !isReflectCall && !userConfiguredException && (!requiresObjectCallee || isObjectCallee)) {
                const existing = existingNames[methodName];
                const substitute = `Reflect.${reflectSubstitutes[methodName]}`;

                if (methodName === "apply") {
                    report(node, existing, substitute, (fixer) => {
                        if (node.arguments.some((argument) => argument.type === "SpreadElement")) {
                            return null;
                        }
                        const funcText = getText(node.callee.object);
                        if (node.arguments.length === 0) {
                            return fixer.replaceText(node, `Reflect.apply(${funcText}, undefined, [])`);
                        }
                        const thisArgText = getText(node.arguments[0]);
                        const applyArgsText = node.arguments.length === 1 ? "[]" : getText(node.arguments[1]);
                        return fixer.replaceText(node, `Reflect.apply(${funcText}, ${thisArgText}, ${applyArgsText})`);
                    });
                } else if (methodName === "call") {
                    report(node, existing, substitute, (fixer) => {
                        if (node.arguments.some((argument) => argument.type === "SpreadElement")) {
                            return null;
                        }
                        const funcText = getText(node.callee.object);
                        if (node.arguments.length === 0) {
                            return fixer.replaceText(node, `Reflect.apply(${funcText}, undefined, [])`);
                        }
                        const thisArgText = getText(node.arguments[0]);
                        const callArgs = node.arguments.slice(1);
                        if (callArgs.length === 0) {
                            return fixer.replaceText(node, `Reflect.apply(${funcText}, ${thisArgText}, [])`);
                        }
                        const argsText = callArgs.map((a) => getText(a)).join(", ");
                        return fixer.replaceText(node, `Reflect.apply(${funcText}, ${thisArgText}, [${argsText}])`);
                    });
                } else if (methodName === "getOwnPropertyNames") {
                    report(node, existing, substitute, (fixer) =>
                        fixer.replaceText(node.callee, "Reflect.ownKeys"),
                    );
                } else {
                    report(node, existing, substitute, (fixer) =>
                        fixer.replaceText(node.callee.object, "Reflect"),
                    );
                }
            }
        },
        UnaryExpression: (node) => {
            const isDeleteOperator = node.operator === "delete";
            const targetsIdentifier = node.argument.type === "Identifier";
            const userConfiguredException = exceptions.includes("deleteProperty");

            if (isDeleteOperator && !targetsIdentifier && !userConfiguredException) {
                report(node, "the delete keyword", "Reflect.deleteProperty", (fixer) => {
                    const arg = node.argument;
                    if (arg.type !== "MemberExpression") {
                        return null;
                    }
                    const objText = getText(arg.object);
                    if (arg.computed) {
                        return fixer.replaceText(node, `Reflect.deleteProperty(${objText}, ${getText(arg.property)})`);
                    }
                    return fixer.replaceText(node, `Reflect.deleteProperty(${objText}, '${getText(arg.property)}')`);
                });
            }
        },
        BinaryExpression: (node) => {
            const isInOperator = node.operator === "in";
            const userConfiguredException = exceptions.includes("has");

            if (isInOperator && !userConfiguredException) {
                report(node, "the in keyword", "Reflect.has", (fixer) => {
                    const leftText = node.left.type === "SequenceExpression" ? `(${getText(node.left)})` : getText(node.left);
                    const rightText = getText(node.right);
                    return fixer.replaceText(node, `Reflect.has(${rightText}, ${leftText})`);
                });
            }
        },
    };
};
export default { meta, create };
