import git from "./git.js";
import IS_IN_GITHUB_ACTIONS from "./IS_IN_GITHUB_ACTIONS.js";
if (!IS_IN_GITHUB_ACTIONS) {
    console.info("Not running in github actions, exit.");
    // eslint-disable-next-line n/no-process-exit
    process.exit(0);
}
/**
 * @type { string | false } when false, it means the HEAD does not point to a branch.
 */
let result;
try {
    result = await git.revparse(["--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
    console.info("[getUpstream]", "upstream:", result);
} catch (e) {
    if (e?.message?.includes("HEAD does not point to a branch")) {
        console.info("[getUpstream]", "HEAD does not point to a branch.");
    } else {
        console.error("[getUpstream]", "Unexpected error:", e);
    }
    result = false;
}
export default result;
