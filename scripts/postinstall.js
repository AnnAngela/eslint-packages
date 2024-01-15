// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable security/detect-object-injection, security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import { readPackageJSON, writePackageJSON, resolvePackageJSON } from "pkg-types";
import exec from "./spawnChildProcess.js";

const IS_IN_GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === "true";
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
    const pkgPackageJSONPath = await resolvePackageJSON(path.resolve("./packages", pkg));
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
                console.warn(`[${pkg}]`, `[${property}]`, `Version mismatch for ${dependencyName}: ${dependencyVersionString} vs ${lockInfo.version}`);
                pkgChanged = true;
                pkgPackageJSON[property][dependencyName] = lockInfo.version;
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
for (const file of ["./eslint.config.js", ...(await fs.promises.readdir("./scripts")).map((f) => `./scripts/${f}`)]) {
    const content = `\n${await fs.promises.readFile(file, { encoding: "utf-8" })}`;
    const matches = content.match(/(?<=\nimport)[^\n]+? from "[^\n"]+";?\n/g);
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
if (IS_IN_GITHUB_ACTIONS && globalChanged) {
    console.info("Running in GitHub Actions, commit the changes.");
    await exec("git add .", { synchronousStderr: true, synchronousStdout: true });
    await exec("git commit -m \"chore: update dependencies\"", { synchronousStderr: true, synchronousStdout: true });
    await exec("git push", { synchronousStderr: true, synchronousStdout: true });
}
console.info("Done.");
