/* eslint-disable security/detect-object-injection, security/detect-non-literal-fs-filename */
console.info("-".repeat(73));

import fs from "node:fs";
import path from "node:path";
import { readPackageJSON, writePackageJSON, resolvePackageJSON } from "pkg-types";
import IS_IN_GITHUB_ACTIONS from "./modules/IS_IN_GITHUB_ACTIONS.js";
import git from "./modules/git.js";
import upstreamExist from "./modules/getUpstream.js";

const IS_DRY_RUN = process.argv.includes("--dry-run");

/**
 * @type { import("../package-lock.json") }
 */
const packageLockJSON = JSON.parse(await fs.promises.readFile("./package-lock.json", "utf8"));
/**
 * @type { import("../package.json") }
 */
const packageJSON = await readPackageJSON();
const packages = await fs.promises.readdir("./packages");

let globalChanged = false;
console.info("Start to update the package.json of packages/");
const unusedDependencies = new Set(Object.keys(packageJSON.dependencies));
for (const pkg of packages) {
    console.info(`[${pkg}]`, "Start to update package.json");
    const pkgPath = path.resolve("./packages", pkg);
    const pkgPackageJSONPath = await resolvePackageJSON(pkgPath);
    const pkgPackageJSON = await readPackageJSON(pkgPackageJSONPath);
    let pkgChanged = false;
    for (const property of ["dependencies", "devDependencies"]) {
        if (!Reflect.has(pkgPackageJSON, property)) {
            continue;
        }
        for (const [dependencyName, dependencyVersionString] of Object.entries(pkgPackageJSON[property])) {
            unusedDependencies.delete(dependencyName);
            /**
             * @type { { version: string } | undefined }
             */
            const lockInfo = packageLockJSON.packages[`node_modules/${dependencyName}`];
            if (lockInfo?.version && dependencyVersionString !== `^${lockInfo.version}`) {
                console.warn(`[${pkg}]`, `[${property}]`, `Version mismatch for ${dependencyName}: ${dependencyVersionString} vs ^${lockInfo.version}`);
                pkgChanged = true;
                pkgPackageJSON[property][dependencyName] = `^${lockInfo.version}`;
            }
        }
    }
    if (pkgChanged) {
        globalChanged = true;
        console.info(`[${pkg}]`, "There are some changes in package.json, write it back");
        if (!IS_DRY_RUN) {
            await writePackageJSON(pkgPackageJSONPath, pkgPackageJSON);
        }
    } else {
        console.info(`[${pkg}]`, "There is no change in package.json");
    }
}

console.info("Parsing the scripts to exclude used dependencies");
for (const file of ["./eslint.config.js", ...(await fs.promises.readdir("./scripts", { withFileTypes: true, recursive: true })).filter((dirent) => dirent.isFile()).map((dirent) => path.resolve(dirent.path, dirent.name))]) {
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

console.info("process.env.GITHUB_REF:", process.env.GITHUB_REF);

if (!globalChanged) {
    console.info("There is no change in package.json.");
} else if (!IS_IN_GITHUB_ACTIONS) {
    console.info("Not running in GitHub Actions, skip.");
} else if (!upstreamExist) {
    console.info("Running in GitHub Actions, but the upstream does not exist, skip.");
} else if (!process.env.GITHUB_REF?.startsWith("refs/heads/")) {
    console.info("Running in GitHub Actions, but the current ref is not a branch, skip.");
} else {
    console.info("Running in GitHub Actions, commit the changes.");
    await git.add(".")
        .commit("chore: update dependencies")
        .push();
}

console.info("Done.");

console.info("-".repeat(73));
