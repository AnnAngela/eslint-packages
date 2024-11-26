import stylistic from "@stylistic/eslint-plugin";
import preferReflectPlugin from "@annangela/eslint-plugin-prefer-reflect";
import preferArrowFunctionsPlugin from "eslint-plugin-prefer-arrow-functions";
import eslintJS from "@eslint/js";
import promiseLegacyPlugin from "eslint-plugin-promise";
import commentsLegacyPlugin from "@eslint-community/eslint-plugin-eslint-comments";

import globals from "globals";

const transferLegacyPluginIntoFlatConfig = (legacyPlugin) => {
    const rules = {
        ...legacyPlugin.configs.recommended.rules,
    };
    Reflect.deleteProperty(legacyPlugin, "configs");
    return [
        legacyPlugin,
        rules,
    ];
};

const stylisticPlugin = stylistic.configs.customize({
    flat: true,
    indent: 4,
    quotes: "double",
    semi: true,
    jsx: false,
    arrowParens: true,
    braceStyle: "1tbs",
    commaDangle: "always-multiline",
    quoteProps: "as-needed",
});
const [promisePlugin, promisePluginRules] = transferLegacyPluginIntoFlatConfig(promiseLegacyPlugin);
const [commentsPlugin, commentsPluginRules] = transferLegacyPluginIntoFlatConfig(commentsLegacyPlugin);
/**
 * @type { Omit<import("eslint").Linter.Config, "files" | "ignores"> }
 */
const config = { // `baseConfig`: Default config
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
        ecmaVersion: 2022, // Node 20 - https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases
        parserOptions: {
            ecmaVersion: 2022, // Node 20 - https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases
        },
        globals: {
            ...globals.builtin,
            ...globals.es2022,
        },
    },
    plugins: {
        ...stylisticPlugin.plugins,
        promise: promisePlugin,
        "@eslint-community/eslint-comments": commentsPlugin,
        "@annangela/prefer-reflect": preferReflectPlugin,
        "prefer-arrow-functions": preferArrowFunctionsPlugin,
    },
    rules: {
        // eslintJS
        ...eslintJS.configs.recommended.rules,
        camelcase: "error",
        curly: "error",
        "dot-notation": "error",
        eqeqeq: "error",
        "logical-assignment-operators": "error",
        "no-console": "off",
        "no-else-return": "error",
        "no-empty": [
            "error",
            {
                allowEmptyCatch: true,
            },
        ],
        "no-extra-bind": "error",
        "no-inner-declarations": "off",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        "no-magic-numbers": "off",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-object-constructor": "error",
        "no-param-reassign": "error",
        "no-template-curly-in-string": "error",
        "no-unused-vars": [
            "error",
            {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "all",
                argsIgnorePattern: "^_",
                caughtErrors: "all",
                caughtErrorsIgnorePattern: "^_",
                ignoreRestSiblings: true,
            },
        ],
        "no-use-before-define": "error",
        "no-useless-computed-key": "error",
        "no-var": "error",
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-exponentiation-operator": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "require-atomic-updates": "error",
        "require-await": "error",
        strict: [
            "error",
            "global",
        ],

        // stylisticPlugin
        ...stylisticPlugin.rules,
        "@stylistic/indent": [
            "warn",
            4,
            {
                SwitchCase: 1,
            },
        ],
        "@stylistic/linebreak-style": "error",
        "@stylistic/lines-between-class-members": "off",
        "@stylistic/no-extra-parens": "error",
        "@stylistic/quote-props": [
            "error",
            "as-needed",
            {
                keywords: true,
                unnecessary: true,
                numbers: false,
            },
        ],
        "@stylistic/quotes": [
            "error",
            "double",
            {
                avoidEscape: true,
                allowTemplateLiterals: false,
            },
        ],
        "@stylistic/multiline-ternary": [
            "error",
            "always-multiline",
        ],

        // promisePlugin
        ...promisePluginRules,
        "promise/no-multiple-resolved": "error",
        "promise/prefer-await-to-callbacks": "error",
        "promise/always-return": [
            "error",
            { ignoreLastCallback: true },
        ],
        "promise/prefer-await-to-then": "error",
        "promise/param-names": [
            "error",
            {
                resolvePattern: "^_?res(?:olve)?$",
                rejectPattern: "^_?rej(?:ect)?$",
            },
        ],
        "promise/prefer-catch": "error",

        // commentsPlugin
        ...commentsPluginRules,
        "@eslint-community/eslint-comments/disable-enable-pair": [
            "error",
            { allowWholeFile: true },
        ],

        // @annangela/prefer-reflect
        "@annangela/prefer-reflect/prefer-reflect": "error",

        // prefer-arrow-functions
        "prefer-arrow-functions/prefer-arrow-functions": [
            "error",
            {
                classPropertiesAllowed: true,
                disallowPrototype: true,
                returnStyle: "implicit",
                singleReturnOnly: false,
            },
        ],
    },
};
export default config;
