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

    docs: {
        description: "Modern version of original `prefer-reflect` rules in eslint",
        recommended: true,
        url: "https://eslint.org/docs/rules/prefer-reflect",
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
                },
            },
            additionalProperties: false,
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

    const exceptions = context.options[0]?.exceptions || [];

    /**
     * Reports the Reflect violation based on the `existing` and `substitute`
     * @param {Object} node The node that violates the rule.
     * @param {string} existing The existing method name that has been used.
     * @param {string} substitute The Reflect substitute that should be used.
     * @returns {void}
     */
    const report = (node, existing, substitute) => {
        context.report({
            node,
            messageId: "preferReflect",
            data: {
                existing,
                substitute,
            },
        });
    };

    return {
        CallExpression: (node) => {
            const methodName = node.callee.property?.name;
            const isReflectCall = node.callee.object?.name === "Reflect";
            const hasReflectSubstitute = typeof reflectSubstitutes[methodName] === "string";
            const userConfiguredException = exceptions.includes(reflectSubstitutes[methodName]);

            if (hasReflectSubstitute && !isReflectCall && !userConfiguredException) {
                report(node, existingNames[methodName], `Reflect.${reflectSubstitutes[methodName]}`);
            }
        },
        UnaryExpression: (node) => {
            const isDeleteOperator = node.operator === "delete";
            const targetsIdentifier = node.argument.type === "Identifier";
            const userConfiguredException = exceptions.includes("deleteProperty");

            if (isDeleteOperator && !targetsIdentifier && !userConfiguredException) {
                report(node, "the delete keyword", "Reflect.deleteProperty");
            }
        },
        BinaryExpression: (node) => {
            const isInOperator = node.operator === "in";
            const userConfiguredException = exceptions.includes("has");

            if (isInOperator && !userConfiguredException) {
                report(node, "the in keyword", "Reflect.has");
            }
        },
    };
};
export default { meta, create };
