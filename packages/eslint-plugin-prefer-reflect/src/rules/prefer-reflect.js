/**
 * @fileoverview Modern version of original "prefer-reflect" rules in eslint
 * @author AnnAngela
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

import { version } from "../meta.generated.js";

/** Supported method names for the `exceptions` schema enum */
const EXCEPTION_NAMES = [
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
];

/**
 * @type { import('eslint').Rule.RuleMetaData }
 */
export const meta = {
    type: "suggestion",
    fixable: "code",
    hasSuggestions: true,
    version,

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
                        "enum": EXCEPTION_NAMES,
                    },
                    uniqueItems: true,
                    description: "Exceptions",
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
        preferReflectSpreadSuggest: "Replace with Reflect.apply using {{spreadTarget}}[0] as thisArg and {{spreadTarget}}.slice(1) as args",
        preferReflectApplySpreadSuggest: "Replace with Reflect.apply, passing the spread target directly as argumentsList",
        preferReflectOwnKeysSuggest: "Replace with Reflect.ownKeys",
        preferReflectDeleteNonMemberSuggest: "Remove the delete keyword (the operand is not a property reference)",
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
     * Checks whether a variable name is shadowed (declared by user code)
     * in the given scope or any ancestor scope.
     *
     * A variable is considered shadowed when a user declaration exists
     * (variable.identifiers.length > 0), as opposed to predefined globals
     * like `Object`, `Array`, `console` which have identifiers.length === 0.
     *
     * @see https://eslint.org/docs/latest/extend/scope-manager-interface
     * @see eslint/lib/rules/no-object-constructor.js for the reference pattern
     * @param {import('eslint').Scope.Scope} scope
     * @param {string} name
     * @returns {boolean}
     */
    const isVariableShadowed = (scope, name) => {
        let currentScope = scope;
        while (currentScope) {
            const variable = currentScope.set.get(name);
            if (variable) {
                // identifiers.length > 0: declared in user code (shadowed)
                // identifiers.length === 0: predefined global (not shadowed)
                return variable.identifiers.length > 0;
            }
            currentScope = currentScope.upper;
        }
    };

    return {
        CallExpression: (node) => {
            //
            // Architecture overview:
            //
            // This visitor handles four categories of method calls, each with
            // distinct semantics that prevent naive merging:
            //
            // 1. apply: callee is the function, arguments[0] is thisArg,
            //    arguments[1] (if present) is the argumentsList. The
            //    spread-at-argsList case is unique to apply (spread in 2nd
            //    argument position).
            //
            // 2. call: callee is the function, arguments[0] is thisArg,
            //    arguments[1..] are individual args to pack into an
            //    argumentsList. The spread-at-thisArg handling mirrors apply's
            //    spread-at-argsList structurally, but operates on a different
            //    argument position.
            //
            // 3. getOwnPropertyNames: semantically inequivalent to
            //    Reflect.ownKeys (ownKeys also returns Symbols), so always a
            //    suggestion, never an auto-fix.
            //
            // 4. else: trivial Object.X → Reflect.X rename for the remaining
            //    methods. No argument restructuring needed.
            //
            // While apply and call share the "single spread argument" detection
            // pattern (both produce Reflect.apply(func, x[0], x.slice(1))),
            // the spread appears in different positions (argsList vs thisArg)
            // and the non-spread fallback logic differs substantially, so
            // extracting a shared helper would obscure rather than clarify
            // the intent.
            //
            const methodName = node.callee.property?.name;
            const isReflectCall = node.callee.object?.name === "Reflect";
            const hasReflectSubstitute = typeof reflectSubstitutes[methodName] === "string";
            const userConfiguredException = exceptions.includes(reflectSubstitutes[methodName]);
            const requiresObjectCallee = methodName !== "apply" && methodName !== "call";
            const isObjectCallee = node.callee.object?.type === "Identifier"
                && node.callee.object.name === "Object"
                && !isVariableShadowed(sourceCode.getScope(node), "Object");

            if (hasReflectSubstitute && !isReflectCall && !userConfiguredException && (!requiresObjectCallee || isObjectCallee)) {
                const existing = existingNames[methodName];
                const substitute = `Reflect.${reflectSubstitutes[methodName]}`;

                if (methodName === "apply") {
                    const funcText = wrapSequence(node.callee.object);

                    // When the only argument is a spread (e.g. func.apply(...all)),
                    // we cannot statically guarantee the spread provides ≥2 elements.
                    // Reflect.apply requires exactly 3 args, so an auto-fix can
                    // silently turn working code into a TypeError at runtime.
                    // Downgrade to a suggestion instead.
                    if (node.arguments.length === 1 && node.arguments[0].type === "SpreadElement") {
                        const spreadArg = node.arguments[0].argument;
                        const spreadText = getText(spreadArg);

                        if (spreadArg.type === "Identifier") {
                            context.report({
                                node,
                                messageId: "preferReflect",
                                data: { existing, substitute },
                                suggest: [{
                                    messageId: "preferReflectSpreadSuggest",
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
                        // Check if argsList is a spread (e.g. func.apply(thisArg, ...rest)).
                        // The spread inside .apply() is almost always a mistake — the
                        // programmer intended `rest` to be the argumentsList, not to
                        // be spread element-by-element. Reflect.apply requires exactly
                        // 3 arguments, so without a statically guaranteed argumentsList
                        // we downgrade to a suggestion. The suggestion passes the spread
                        // target directly as argumentsList (e.g. Reflect.apply(func,
                        // thisArg, rest)), which correctly maps the programmer's intent.
                        const argsListIsSpread = node.arguments.length >= 2 && node.arguments[1].type === "SpreadElement";

                        if (argsListIsSpread) {
                            // node.arguments.length >= 2 guarantees firstArg exists
                            const firstArg = node.arguments[0];
                            const thisArgText = wrapSequence(firstArg);
                            const spreadArg = node.arguments[1].argument;
                            const spreadText = getText(spreadArg);

                            if (spreadArg.type === "Identifier") {
                                // For simple identifiers, provide a suggestion that passes
                                // the spread target directly as argumentsList to
                                // Reflect.apply, correcting the inadvertent spread
                                // on the original .apply() call.
                                const extraArgs = node.arguments.slice(2).map(
                                    (a) => wrapSequence(a),
                                ).join(", ");
                                const extraPart = extraArgs ? `, ${extraArgs}` : "";
                                context.report({
                                    node,
                                    messageId: "preferReflect",
                                    data: { existing, substitute },
                                    suggest: [{
                                        messageId: "preferReflectApplySpreadSuggest",
                                        fix: (fixer) => fixer.replaceText(
                                            node,
                                            `Reflect.apply(${funcText}, ${thisArgText}, ${spreadText}${extraPart})`,
                                        ),
                                    }],
                                });
                            } else {
                                // Non-Identifier spread (e.g. func.apply(thisArg, ...getArgs()))
                                // cannot be safely restructured; report without fix/suggestion.
                                context.report({
                                    node,
                                    messageId: "preferReflect",
                                    data: { existing, substitute },
                                });
                            }
                        } else {
                            context.report({
                                node,
                                messageId: "preferReflect",
                                data: { existing, substitute },
                                fix: (fixer) => {
                                    if (node.arguments.length === 0) {
                                        return fixer.replaceText(node, `Reflect.apply(${funcText}, undefined, [])`);
                                    }
                                    const firstArg = node.arguments[0];
                                    const thisArgText = wrapSequence(firstArg);
                                    if (node.arguments.length === 1) {
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
                                },
                            });
                        }
                    }
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
                                    messageId: "preferReflectSpreadSuggest",
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
                        context.report({
                            node,
                            messageId: "preferReflect",
                            data: { existing, substitute },
                            fix: (fixer) => {
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
                            },
                        });
                    }
                } else if (methodName === "getOwnPropertyNames") {
                    // Object.getOwnPropertyNames → Reflect.ownKeys is NOT semantically
                    // equivalent: Reflect.ownKeys also returns Symbol keys.
                    // Auto-fix could silently change program behavior, so downgrade
                    // to a suggestion instead.
                    context.report({
                        node,
                        messageId: "preferReflect",
                        data: { existing, substitute },
                        suggest: [{
                            messageId: "preferReflectOwnKeysSuggest",
                            fix: (fixer) => fixer.replaceText(node.callee, "Reflect.ownKeys"),
                        }],
                    });
                } else {
                    context.report({
                        node,
                        messageId: "preferReflect",
                        data: { existing, substitute },
                        fix: (fixer) => fixer.replaceText(node.callee.object, "Reflect"),
                    });
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
                    context.report({
                        node,
                        messageId: "preferReflect",
                        data: { existing: "the delete keyword", substitute: "Reflect.deleteProperty" },
                        fix: (fixer) => {
                            const objText = wrapSequence(arg.object);
                            if (arg.computed) {
                                return fixer.replaceText(
                                    node,
                                    `Reflect.deleteProperty(${objText}, ${wrapSequence(arg.property)})`,
                                );
                            }
                            return fixer.replaceText(
                                node,
                                `Reflect.deleteProperty(${objText}, ${JSON.stringify(arg.property.name)})`,
                            );
                        },
                    });
                } else {
                    //
                    // Non-member-expression targets (e.g. delete foo(),
                    // delete (a, b)) have no direct Reflect.deleteProperty
                    // equivalent because the operand is not a property
                    // reference.
                    //
                    // Semantic trade-off of this suggestion:
                    //
                    // The `delete` operator always returns a boolean. Removing
                    // `delete` changes the expression's return value from
                    // boolean to the operand's return value.
                    //
                    // This is offered as a *suggestion* (not auto-fix) because:
                    // 1. ESLint suggestions are opt-in and explicitly documented
                    //    as potentially changing semantics — see:
                    //    https://eslint.org/docs/latest/extend/custom-rules
                    // 2. The suggestion is safe when the expression appears in
                    //    statement position (value is discarded) or in a void
                    //    context.
                    // 3. If the return value is used, the user can inspect and
                    //    decline the suggestion through their editor/CLI.
                    //
                    context.report({
                        node,
                        messageId: "preferReflect",
                        data: { existing: "the delete keyword", substitute: "Reflect.deleteProperty" },
                        suggest: [{
                            messageId: "preferReflectDeleteNonMemberSuggest",
                            fix: (fixer) => fixer.replaceText(node, wrapSequence(arg)),
                        }],
                    });
                }
            }
        },
        BinaryExpression: (node) => {
            const isInOperator = node.operator === "in";
            const userConfiguredException = exceptions.includes("has");

            if (isInOperator && !userConfiguredException) {
                context.report({
                    node,
                    messageId: "preferReflect",
                    data: { existing: "the in keyword", substitute: "Reflect.has" },
                    fix: (fixer) => {
                        const leftText = wrapSequence(node.left);
                        const rightText = wrapSequence(node.right);
                        return fixer.replaceText(node, `Reflect.has(${rightText}, ${leftText})`);
                    },
                });
            }
        },
    };
};
export default { meta, create };
