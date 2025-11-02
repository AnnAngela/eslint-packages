console.info("-".repeat(73));

import { endGroup, startGroup } from "@actions/core";
import fs from "node:fs";
import path from "node:path";
import { readPackageJSON, resolvePackageJSON, writePackageJSON } from "pkg-types";
import IS_IN_GITHUB_ACTIONS from "./modules/IS_IN_GITHUB_ACTIONS.js";
import upstreamExist from "./modules/getUpstream.js";
import git from "./modules/git.js";

const IS_DRY_RUN = process.argv.includes("--dry-run");

/**
 * @type { import("../package-lock.json") }
 */
const packageLockJSON = JSON.parse(await fs.promises.readFile("./package-lock.json", "utf8"));
/**
 * @type { import("../package.json") }
 */
const packageJSON = await readPackageJSON();

let globalChanged = false;
console.info("Start to update the package.json of packages/");
const unusedDependencies = new Set(Object.keys(packageJSON.dependencies));
/**
 * @type { Record<string, { pkgPath, pkgJSONPath: string, pkgJSON: Awaited<ReturnType<readPackageJSON>> }> }
 */
const packagesList = Object.fromEntries(await Promise.all((await fs.promises.readdir("./packages")).map(async (pkg) => {
    const pkgPath = path.resolve("./packages", pkg);
    return [
        pkg,
        {
            pkgJSONPath: await resolvePackageJSON(pkgPath),
            pkgJSON: await readPackageJSON(await resolvePackageJSON(pkgPath)),
        },
    ];
})));
for (const [pkg, { pkgJSONPath, pkgJSON }] of Object.entries(packagesList)) {
    console.info(`[${pkg}]`, "Start to update package.json");
    let pkgChanged = false;
    for (const property of ["dependencies", "devDependencies"]) {
        if (!Reflect.has(pkgJSON, property)) {
            continue;
        }
        for (const [dependencyName, dependencyVersionString] of Object.entries(pkgJSON[property])) {
            unusedDependencies.delete(dependencyName);
            /**
             * @type { { version: string } | undefined }
             */
            const lockInfo = packageLockJSON.packages[`node_modules/${dependencyName}`];
            if (typeof lockInfo?.version === "string") {
                const targetVersion = `^${lockInfo.version}`;
                if (dependencyVersionString !== `^${lockInfo.version}`) {
                    console.warn(`[${pkg}]`, `[${property}]`, `Version mismatch for ${dependencyName}: ${dependencyVersionString} vs ${targetVersion} by dependency`);
                    pkgChanged = true;
                    pkgJSON[property][dependencyName] = targetVersion;
                }
            } else {
                const localPackageName = dependencyName.replace(/^@[^/]+\//, "");
                if (Reflect.has(packagesList, localPackageName)) {
                    const targetVersion = `^${packagesList[localPackageName].pkgJSON.version}`;
                    if (dependencyVersionString !== targetVersion) {
                        console.warn(`[${pkg}]`, `[${property}]`, `Version mismatch for ${dependencyName}: ${dependencyVersionString} vs ${targetVersion} by local package`);
                        pkgChanged = true;
                        pkgJSON[property][dependencyName] = targetVersion;
                    }
                }
            }
        }
    }
    if (pkgJSON.engines.node !== packageJSON.engines.node) {
        console.warn(`[${pkg}]`, `Node version mismatch: ${pkgJSON.engines.node} vs ${packageJSON.engines.node}`);
        pkgChanged = true;
        pkgJSON.engines.node = packageJSON.engines.node;
    }
    if (pkgChanged) {
        globalChanged = true;
        console.info(`[${pkg}]`, "There are some changes in package.json, write it back");
        if (!IS_DRY_RUN) {
            await writePackageJSON(pkgJSONPath, pkgJSON);
        }
    } else {
        console.info(`[${pkg}]`, "There is no change in package.json");
    }
}

console.info("Parsing the scripts to exclude used dependencies");
const dir = (await fs.promises.readdir("./scripts", { withFileTypes: true, recursive: true })).filter((dirent) => dirent.isFile());
console.info(`Found ${dir.length} files in scripts/`, dir);
for (const file of ["./eslint.config.js", ...dir.map((dirent) => path.resolve(dirent.path, dirent.name))]) {
    const content = `\n${await fs.promises.readFile(file, { encoding: "utf-8" })}`;
    const matches = content.match(/(?<=\nimport)[^\n]+? from "[^\n"]+";?\n/g);
    if (!matches) {
        continue;
    }
    for (const match of matches) {
        const dependencyName = match.match(/(?<= from ")[^"]+/)?.[0];
        if (dependencyName && !/^node:|^\./.test(dependencyName)) {
            unusedDependencies.delete(dependencyName);
        }
    }
}

if (unusedDependencies.size > 0) {
    process.emitWarning(`There are some unused dependencies: ${[...unusedDependencies].join(", ")}`);
} else {
    console.info("There is no unused dependency");
}

if (!globalChanged) {
    console.info("There is no change in package.json.");
} else if (!IS_IN_GITHUB_ACTIONS) {
    console.info("Not running in GitHub Actions, skip committing.");
} else if (!upstreamExist) {
    console.info("Running in GitHub Actions, but the upstream does not exist, skip committing.");
} else if (process.env.GITHUB_REF !== "refs/heads/master") {
    console.info("Running in GitHub Actions, but the current ref is not a branch, skip committing.");
} else {
    console.info("Running in GitHub Actions, commit the changes.");
    startGroup("Add result:");
    console.info(await git.add("."));
    endGroup();
    startGroup("Commit result:");
    console.info(await git.commit("chore: update dependencies"));
    endGroup();
    startGroup("Push result:");
    console.info(await git.push());
    endGroup();
}

console.info("Done.");

console.info("-".repeat(73));
