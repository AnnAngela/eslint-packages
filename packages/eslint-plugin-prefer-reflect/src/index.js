/**
 * @fileoverview Modern version of original `prefer-reflect` rules in eslint
 * @author AnnAngela
 */

// ------------------------------------------------------------------------------
// Plugin Definition
// ------------------------------------------------------------------------------

// import all rules in lib/rules
import preferReflect from "./rules/prefer-reflect.js";
import { name, namespace, version } from "./meta.generated.js";

export const rules = {
    "prefer-reflect": preferReflect,
};

export default {
    meta: { name, namespace, version },
    rules,
};
