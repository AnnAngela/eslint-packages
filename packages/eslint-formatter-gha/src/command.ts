import type { notice } from "@actions/core";
import type { Linter } from "eslint";

export type logSeverity = "debug" | "notice" | "warning" | "error";
type annotationPropertiesTypeNullable = Parameters<typeof notice>[1];
// Strip `undefined` from every field inherited from @actions/core's AnnotationProperties (?-optional fields)
export type annotationPropertiesType = {
    [K in keyof NonNullable<annotationPropertiesTypeNullable>]: NonNullable<
        NonNullable<annotationPropertiesTypeNullable>[K]
    >;
};
export const eslintSeverityToAnnotationSeverity: Record<Linter.Severity, logSeverity> = {
    0: "notice",
    1: "warning",
    2: "error",
};

// Inlined from @actions/core/lib/command.js to avoid adding @actions/core as a runtime dependency.
// Only `import type` (L1) references it, so zero runtime code from @actions/core lands in dist.
const escapeProperty = (s: string | number) => `${s}`.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A").replaceAll(":", "%3A").replaceAll(",", "%2C");
const escapeData = (s: string | number) => `${s}`.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");
export const log = (severity: logSeverity, msg: string, annotationProperties?: annotationPropertiesType) => {
    if (severity === "debug") {
        console.info(`::debug::${escapeData(msg)}`);
        return;
    }
    console.info(`::${severity}${annotationProperties ? ` ${Object.entries(annotationProperties).map(([k, v]) => `${k}=${escapeProperty(v)}`).join(",")}` : ""}::${escapeData(msg)}`);
};
