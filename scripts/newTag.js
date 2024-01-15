import { createInterface } from "node:readline";
import { valid, gt } from "semver";
import path from "node:path";
import execCommand from "./spawnChildProcess.js";

const pkg = process.env.npm_package_name;
const rootDir = path.resolve(process.cwd(), "../..");
console.info("Root directory:", rootDir);
console.info("Current package:", pkg);

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});
const oldTag = process.env.npm_package_version;
console.log(`Current tag: ${oldTag}`);

let tag = valid(await new Promise((res) => {
    rl.question("Enter a tag: ", (tag) => {
        rl.close();
        res(tag);
    });
}));
if (!tag) {
    throw new Error("Invalid tag");
}
if (!tag.startsWith("v")) {
    tag = `v${tag}`;
}
if (!gt(tag, oldTag)) {
    throw new Error(`New tag (${tag}) must be greater than old tag (${oldTag})`);
}
const tagList = (await execCommand("git tag -l")).split("\n");
if (tagList.includes(tag)) {
    throw new Error(`Tag ${tag} already exists`);
}

console.log(`tag: ${tag}`);

console.log("Bump the package version");
await execCommand(`npm version ${tag.replace(/^v/, "")} -m "release: ${pkg}@v%s"`, { synchronousStderr: true, synchronousStdout: true });
await execCommand(`git tag -s ${pkg}@${tag}`, { synchronousStderr: true, synchronousStdout: true, cwd: rootDir });

console.log("Pushing...");
await execCommand("git push --follow-tags", { synchronousStderr: true, synchronousStdout: true, cwd: rootDir });

const draftReleaseURL = new URL(JSON.parse(await execCommand("npm pkg get homepage", { cwd: rootDir })));
draftReleaseURL.hash = "";
draftReleaseURL.pathname += "/releases/new";
console.log("Draft release URL:", draftReleaseURL.toString());
console.log("Release title:", `${pkg}@${tag}`);
console.log("Example changelog:");
console.log("-".repeat(73));
await execCommand(`git log --reverse --pretty=format:"* %s (%h)" v${oldTag}...${tag}`, { synchronousStderr: true, synchronousStdout: true, cwd: rootDir });
console.info("");
console.log("-".repeat(73));
