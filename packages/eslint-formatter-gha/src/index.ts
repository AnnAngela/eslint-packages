// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable security/detect-object-injection */
import path from "path";
import type { ESLint } from "eslint";
import ActionsSummary from "./ActionsSummary.js";
import { logSeverity, annotationPropertiesType, eslintSeverityToAnnotationSeverity, log } from "./command.js";

const GITHUB_SHA = process.env.GITHUB_SHA;

const generateESLintRuleLink = (ruleId: string) => `https://eslint.org/docs/latest/rules/${ruleId}`;

const actionsSummary = new ActionsSummary();

const formatter: ESLint.Formatter["format"] = (results) => {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        suppressedMessages, errorCount, fatalErrorCount, warningCount, fixableErrorCount, fixableWarningCount, output, source,
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
            deprecatedRuleMessageArr.push(` - ${generateESLintRuleLink(ruleId)}`);
            const deprecatedRuleMessage = deprecatedRuleMessageArr.join("");
            if (deprecatedRulesSeverity === "debug") {
                log("debug", deprecatedRuleMessage);
            } else {
                deprecatedRulesSummary.push(`[${ruleId}](${generateESLintRuleLink(ruleId)})${replacedBy.length > 0 ? `: replaced by ${replacedBy.map((ruleId) => `[${ruleId}](${generateESLintRuleLink(ruleId)})`).join(" / ")} ` : ""}`);
                log(deprecatedRulesSeverity, deprecatedRuleMessage, {
                    title: "ESLint Annotation",
                });
            }
        }
        for (const {
            message, severity, line, column, endLine, endColumn, ruleId, fix,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            messageId, nodeType, fatal, source, suggestions,
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
            const fileLink = GITHUB_SHA ? `https://github.com/${process.env.GITHUB_REPOSITORY}/blob/${GITHUB_SHA.slice(0, 7)}/${encodeURI(fileName)}` : "";
            const msgArr = [
                message,
            ];
            if (fix) {
                msgArr.push("[maybe fixable]");
            }
            if (typeof ruleId === "string") {
                msgArr.push(`(${ruleId}) - ${generateESLintRuleLink(ruleId)}`);
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
                summaryLineArr.push(`([${ruleId}](${generateESLintRuleLink(ruleId)}))`);
            }
            if (GITHUB_SHA) {
                msgArr.push(`[${fileName}](${fileLink})`);
            } else {
                msgArr.push(fileName);
            }
            annotationSummary.push(summaryLineArr.join(" "));
            const annotationProperties: annotationPropertiesType = {
                title: "ESLint Annotation",
                file: filePath,
                startLine: line,
                endLine,
                startColumn: column,
                endColumn,
            };
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
