/* eslint-disable security/detect-object-injection */
import path from "node:path";
import type { ESLint } from "eslint";
import ActionsSummary from "./ActionsSummary.js";
import { logSeverity, annotationPropertiesType, eslintSeverityToAnnotationSeverity, log } from "./command.js";

const { GITHUB_SHA, GITHUB_REPOSITORY } = process.env;

const actionsSummary = new ActionsSummary();

const formatter: ESLint.Formatter["format"] = (results, data) => {
    const generateESLintRuleLink = (ruleId: string, md: boolean) => {
        const url = data?.rulesMeta[ruleId].docs?.url;
        return url ? md ? actionsSummary.wrapLink({ text: ruleId, href: url }) : url : ruleId;
    };
    actionsSummary.addEOL();
    actionsSummary.addHeading({ text: "ESLint Annotation", level: 1 });
    actionsSummary.addRaw(`ESLint Annotation from ${actionsSummary.wrapLink({ text: "@annangela/eslint-formatter-gha", href: "https://www.npmjs.com/package/@annangela/eslint-formatter-gha" })}`);
    const deprecatedRulesSeverityFromEnv = process.env.ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY?.toLowerCase();
    const deprecatedRulesSeverities = ["debug", "notice", "warning", "error"];
    // @TODO: Switch to `warning` when eslint 9 is released
    let deprecatedRulesSeverity: logSeverity = "debug";
    if (deprecatedRulesSeverityFromEnv) {
        if (deprecatedRulesSeverities.includes(deprecatedRulesSeverityFromEnv)) {
            deprecatedRulesSeverity = deprecatedRulesSeverityFromEnv as logSeverity;
        } else {
            actionsSummary.addRaw(`${ActionsSummary.EMOJI.warning} The env \`ESLINT_FORMATTER_GHA_DEPRECATED_RULES_SEVERITY\` it is not a valid severity - \`${deprecatedRulesSeverityFromEnv}\`, so the severity of deprecated rules report is set to \`${deprecatedRulesSeverity}\` instead.`);
        }
    }
    const deprecatedRules: string[] = [];
    const deprecatedRulesSummary: string[] = [];
    const annotationSummary: string[] = [];
    for (const {
        filePath, messages, usedDeprecatedRules,
        // suppressedMessages, errorCount, fatalErrorCount, warningCount, fixableErrorCount, fixableWarningCount, output, source,
    } of results) {
        for (const { ruleId, replacedBy } of usedDeprecatedRules) {
            if (deprecatedRules.includes(ruleId)) {
                continue;
            }
            deprecatedRules.push(ruleId);
            const deprecatedRuleMessageArr = [
                `Deprecated rule: ${ruleId}`,
            ];
            if (replacedBy.length > 0) {
                deprecatedRuleMessageArr.push(`, replaced by ${replacedBy.join(" / ")} instead`);
            }
            deprecatedRuleMessageArr.push(` - ${generateESLintRuleLink(ruleId, false)}`);
            const deprecatedRuleMessage = deprecatedRuleMessageArr.join("");
            if (deprecatedRulesSeverity === "debug") {
                log("debug", deprecatedRuleMessage);
            } else {
                deprecatedRulesSummary.push(`${generateESLintRuleLink(ruleId, true)}${replacedBy.length > 0 ? `: replaced by ${replacedBy.map((ruleId) => generateESLintRuleLink(ruleId, true)).join(" / ")} ` : ""}`);
                log(deprecatedRulesSeverity, deprecatedRuleMessage, {
                    title: "ESLint Annotation",
                });
            }
        }
        for (const {
            message, severity, line, column, endLine, endColumn, ruleId, fix,
            // messageId, nodeType, fatal, source, suggestions,
        } of messages) {
            let hash = "";
            if (typeof line === "number") {
                hash += `#L${line}`;
                if (typeof endLine === "number") {
                    let actuallyEndLine = endLine;
                    if (typeof endColumn === "number" && endColumn === 1) {
                        actuallyEndLine--;
                    }
                    if (actuallyEndLine !== line) {
                        hash += `-L${actuallyEndLine}`;
                    }
                }
            }
            const fileName = `${path.relative(process.cwd(), filePath)}${hash}`;
            const fileLink = GITHUB_SHA && GITHUB_REPOSITORY ? `https://github.com/${GITHUB_REPOSITORY}/blob/${GITHUB_SHA.slice(0, 7)}/${encodeURI(fileName)}` : "";
            const msgArr = [
                message,
            ];
            if (fix) {
                msgArr.push("[maybe fixable]");
            }
            if (typeof ruleId === "string") {
                msgArr.push(`(${ruleId}) - ${generateESLintRuleLink(ruleId, false)}`);
            }
            msgArr.push("@");
            if (GITHUB_SHA) {
                msgArr.push(fileLink);
            } else {
                msgArr.push(fileName);
            }
            const msg = msgArr.join(" ");
            const summaryLineArr = [
                ActionsSummary.EMOJI[eslintSeverityToAnnotationSeverity[severity]],
            ];
            if (fix) {
                summaryLineArr.push(ActionsSummary.EMOJI.fixable);
            }
            summaryLineArr.push(message);
            if (typeof ruleId === "string") {
                summaryLineArr.push(`\n  Rule: ${generateESLintRuleLink(ruleId, true)}`);
            }
            summaryLineArr.push("\n File:");
            if (GITHUB_SHA) {
                summaryLineArr.push(`[${fileName}](${fileLink})`);
            } else {
                summaryLineArr.push(fileName);
            }
            annotationSummary.push(summaryLineArr.join(" ").split("\n").map((str) => str.trim()).join("\n"));
            const annotationProperties: annotationPropertiesType = {
                title: "ESLint Annotation",
                file: filePath,
                startLine: line,
                startColumn: column,
            };
            if (typeof endLine === "number") {
                annotationProperties.endLine = endLine;
            }
            if (typeof endColumn === "number") {
                annotationProperties.endColumn = endColumn;
            }
            log("debug", JSON.stringify({ msg, ...annotationProperties }, null, 4));
            log(eslintSeverityToAnnotationSeverity[severity], msg, annotationProperties);
        }
    }
    if (deprecatedRulesSummary.length + annotationSummary.length === 0) {
        actionsSummary.addRaw("Nothing is broken, everything is fine.");
    }
    if (deprecatedRulesSummary.length > 0) {
        actionsSummary.addHeading({ text: `${ActionsSummary.EMOJI[deprecatedRulesSeverity]} Deprecated Rules`, level: 2 });
        actionsSummary.addList({ items: deprecatedRulesSummary });
    }
    if (annotationSummary.length > 0) {
        actionsSummary.addHeading({ text: "Annotations", level: 2 });
        actionsSummary.addList({ items: annotationSummary });
    }
    actionsSummary.write();
    return "";
};
export default formatter;
