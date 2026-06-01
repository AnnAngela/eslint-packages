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
    hasSuggestions: true,

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
        preferReflectCallSpreadSuggest: "Replace with Reflect.apply using {{spreadTarget}}[0] as thisArg and {{spreadTarget}}.slice(1) as args",
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
     * Wraps a node's source text in parentheses if it is a SequenceExpression,
     * to prevent inner commas from leaking into argument-separator positions.
     * @param {import('estree').Node} node
     * @returns {string}
     */
    const wrapSequence = (node) => {
        const text = getText(node);
        return node.type === "SequenceExpression" ? `(${text})` : text;
    };

    /**
     * Reports the Reflect violation based on the `existing` and `substitute`
     * @param {Object} node The node that violates the rule.
     * @param {string} existing The existing method name that has been used.
     * @param {string} substitute The Reflect substitute that should be used.
     * @param {import('eslint').Rule.RuleFixer|null} fix The fix function, or null.
     * @param {import('eslint').Rule.SuggestionReportDescriptor[]} [suggest] Optional suggestions.
     * @returns {void}
     */
    const report = (node, existing, substitute, fix, suggest) => {
        const reportData = {
            node,
            messageId: "preferReflect",
            data: {
                existing,
                substitute,
            },
        };
        if (fix) {
            reportData.fix = fix;
        }
        if (suggest && suggest.length > 0) {
            reportData.suggest = suggest;
        }
        context.report(reportData);
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
                        const funcText = wrapSequence(node.callee.object);
                        if (node.arguments.length === 0) {
                            return fixer.replaceText(node, `Reflect.apply(${funcText}, undefined, [])`);
                        }
                        const firstArg = node.arguments[0];
                        const thisArgText = wrapSequence(firstArg);
                        if (node.arguments.length === 1) {
                            // When the only argument is a spread (e.g. func.apply(...all)),
                            // Reflect.apply(func, ...all) is the correct mapping —
                            // the spread already provides both thisArg and argsList.
                            if (firstArg.type === "SpreadElement") {
                                return fixer.replaceText(node, `Reflect.apply(${funcText}, ${thisArgText})`);
                            }
                            return fixer.replaceText(node, `Reflect.apply(${funcText}, ${thisArgText}, [])`);
                        }
                        const argsListText = wrapSequence(node.arguments[1]);
                        const extraArgs = node.arguments.slice(2).map(
                            (a) => wrapSequence(a),
                        ).join(", ");
                        const extraPart = extraArgs ? `, ${extraArgs}` : "";
                        return fixer.replaceText(
                            node,
                            `Reflect.apply(${funcText}, ${thisArgText}, ${argsListText}${extraPart})`,
                        );
                    });
                } else if (methodName === "call") {
                    const funcText = wrapSequence(node.callee.object);

                    // When the first argument itself is a spread (e.g. func.call(...all)),
                    // we cannot safely split it with a text replacement.
                    if (node.arguments.length > 0 && node.arguments[0].type === "SpreadElement") {
                        const spreadArg = node.arguments[0].argument;
                        const spreadText = getText(spreadArg);

                        if (spreadArg.type === "Identifier") {
                            // For simple identifiers that are likely arrays/array-likes,
                            // suggest a correct restructuring.
                            context.report({
                                node,
                                messageId: "preferReflect",
                                data: { existing, substitute },
                                suggest: [{
                                    messageId: "preferReflectCallSpreadSuggest",
                                    data: { spreadTarget: spreadText },
                                    fix: (fixer) => fixer.replaceText(
                                        node,
                                        `Reflect.apply(${funcText}, ${spreadText}[0], ${spreadText}.slice(1))`,
                                    ),
                                }],
                            });
                        } else {
                            context.report({
                                node,
                                messageId: "preferReflect",
                                data: { existing, substitute },
                            });
                        }
                    } else {
                        report(node, existing, substitute, (fixer) => {
                            if (node.arguments.length === 0) {
                                return fixer.replaceText(node, `Reflect.apply(${funcText}, undefined, [])`);
                            }
                            const thisArgText = wrapSequence(node.arguments[0]);
                            const callArgs = node.arguments.slice(1);
                            if (callArgs.length === 0) {
                                return fixer.replaceText(node, `Reflect.apply(${funcText}, ${thisArgText}, [])`);
                            }
                            const argsText = callArgs.map((a) => wrapSequence(a)).join(", ");
                            return fixer.replaceText(node, `Reflect.apply(${funcText}, ${thisArgText}, [${argsText}])`);
                        });
                    }
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
                const arg = node.argument;
                if (arg.type === "MemberExpression") {
                    report(node, "the delete keyword", "Reflect.deleteProperty", (fixer) => {
                        const objText = wrapSequence(arg.object);
                        if (arg.computed) {
                            return fixer.replaceText(
                                node,
                                `Reflect.deleteProperty(${objText}, ${wrapSequence(arg.property)})`,
                            );
                        }
                        return fixer.replaceText(
                            node,
                            `Reflect.deleteProperty(${objText}, '${getText(arg.property)}')`,
                        );
                    });
                } else {
                    // Non-member-expression targets (e.g. delete foo(), delete (a, b))
                    // have no direct Reflect.deleteProperty equivalent.
                    // Suggest removing the delete keyword instead of returning null.
                    report(node, "the delete keyword", "Reflect.deleteProperty", null, [{
                        desc: "Remove the delete keyword (the operand is not a property reference)",
                        fix: (fixer) => fixer.replaceText(node, wrapSequence(arg)),
                    }]);
                }
            }
        },
        BinaryExpression: (node) => {
            const isInOperator = node.operator === "in";
            const userConfiguredException = exceptions.includes("has");

            if (isInOperator && !userConfiguredException) {
                report(node, "the in keyword", "Reflect.has", (fixer) => {
                    const leftText = wrapSequence(node.left);
                    const rightText = wrapSequence(node.right);
                    return fixer.replaceText(node, `Reflect.has(${rightText}, ${leftText})`);
                });
            }
        },
    };
};
export default { meta, create };
