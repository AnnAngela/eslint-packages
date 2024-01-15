import { simpleGit } from "simple-git";
import IS_IN_GITHUB_ACTIONS from "./IS_IN_GITHUB_ACTIONS.js";

const git = simpleGit({ baseDir: process.cwd() });
if (IS_IN_GITHUB_ACTIONS) {
    console.info("Running in github actions, preparing git...");
    const name = "github-actions[bot]";
    const email = "41898282+github-actions[bot]@users.noreply.github.com";
    console.info("name:", name);
    console.info("email:", email);
    await git
        .add(".")
        .addConfig("user.name", name)
        .addConfig("user.email", email)
        .addConfig("author.name", name)
        .addConfig("author.email", email)
        .addConfig("committer.name", name)
        .addConfig("committer.email", email)
        .addConfig("push.autoSetupRemote", "true");
}
export { git };
export default git;
