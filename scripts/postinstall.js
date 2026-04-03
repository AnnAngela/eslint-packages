console.info("-".repeat(73));

import fs from "node:fs";
import path from "node:path";
import { readPackageJSON, resolvePackageJSON, writePackageJSON } from "pkg-types";

const IS_CHECK = process.argv.includes("--check") || process.argv.includes("--dry-run");

/**
 * @typedef {{
 *     repositoryDirectory?: string
 *     homepage?: string
 *     exports?: Awaited<ReturnType<readPackageJSON>>["exports"]
 * }} DerivedPackageMetadata
 */

/**
 * @type { Record<string, DerivedPackageMetadata> }
 */
const derivedPackageMetadata = {
    "eslint-config": {
        repositoryDirectory: "packages/eslint-config",
        homepage: "https://github.com/AnnAngela/eslint-packages/tree/master/packages/eslint-config#readme",
        exports: {
            ".": {
                types: "./dist/esm/index.d.ts",
                import: "./dist/esm/index.js",
                require: "./dist/cjs/index.js",
            },
            "./tsconfig.node20.json": "./dist/tsconfigs/tsconfig.node20.json",
            "./tsconfig.node20.cjs.json": "./dist/tsconfigs/tsconfig.node20.cjs.json",
            "./tsconfig.node22.json": "./dist/tsconfigs/tsconfig.node22.json",
            "./tsconfig.node22.cjs.json": "./dist/tsconfigs/tsconfig.node22.cjs.json",
            "./tsconfig.node24.json": "./dist/tsconfigs/tsconfig.node24.json",
            "./tsconfig.node24.cjs.json": "./dist/tsconfigs/tsconfig.node24.cjs.json",
            "./tsconfig.browser.json": "./dist/tsconfigs/tsconfig.browser.json",
        },
    },
    "eslint-formatter-gha": {
        repositoryDirectory: "packages/eslint-formatter-gha",
        homepage: "https://github.com/AnnAngela/eslint-packages/tree/master/packages/eslint-formatter-gha#readme",
        exports: {
            ".": "./dist/index.js",
        },
    },
    "eslint-plugin-prefer-reflect": {
        repositoryDirectory: "packages/eslint-plugin-prefer-reflect",
        homepage: "https://github.com/AnnAngela/eslint-packages/tree/master/packages/eslint-plugin-prefer-reflect#readme",
        exports: {
            ".": {
                types: "./dist/esm/index.d.ts",
                import: "./dist/esm/index.js",
                require: "./dist/cjs/index.js",
            },
        },
    },
};

/**
 * @param { NonNullable<Awaited<ReturnType<readPackageJSON>>["overrides"]> | undefined } overrides
 * @param { Awaited<ReturnType<readPackageJSON>> } pkgJSON
 */
const getRelevantOverrides = (overrides, pkgJSON) => {
    if (!overrides) {
        return undefined;
    }
    const relatedDependencies = new Set([
        ...Object.keys(pkgJSON.dependencies ?? {}),
        ...Object.keys(pkgJSON.devDependencies ?? {}),
        ...Object.keys(pkgJSON.peerDependencies ?? {}),
        ...Object.keys(pkgJSON.optionalDependencies ?? {}),
    ]);
    const relevantOverrides = Object.fromEntries(Object.entries(overrides).filter(([dependencySelector]) => {
        const dependencyName = dependencySelector.match(/^(@[^/]+\/[^@]+|[^@]+)/)?.[0];
        return dependencyName && relatedDependencies.has(dependencyName);
    }));
    return Object.keys(relevantOverrides).length > 0 ? relevantOverrides : undefined;
};

/**
 * @param { string } pkg
 * @param { Awaited<ReturnType<readPackageJSON>> } pkgJSON
 */
const syncDerivedMetadata = (pkg, pkgJSON) => {
    let pkgChanged = false;
    const derivedMetadata = derivedPackageMetadata[pkg];
    if (!derivedMetadata) {
        return pkgChanged;
    }
    if (typeof derivedMetadata.repositoryDirectory === "string" && pkgJSON.repository?.directory !== derivedMetadata.repositoryDirectory) {
        console.warn(`[${pkg}]`, `Repository directory mismatch: ${pkgJSON.repository?.directory ?? "(missing)"} vs ${derivedMetadata.repositoryDirectory}`);
        pkgChanged = true;
        pkgJSON.repository ??= {
            type: "git",
            url: "git+https://github.com/AnnAngela/eslint-packages.git",
        };
        pkgJSON.repository.directory = derivedMetadata.repositoryDirectory;
    }
    if (typeof derivedMetadata.homepage === "string" && pkgJSON.homepage !== derivedMetadata.homepage) {
        console.warn(`[${pkg}]`, `Homepage mismatch: ${pkgJSON.homepage ?? "(missing)"} vs ${derivedMetadata.homepage}`);
        pkgChanged = true;
        pkgJSON.homepage = derivedMetadata.homepage;
    }
    if (derivedMetadata.exports && JSON.stringify(pkgJSON.exports) !== JSON.stringify(derivedMetadata.exports)) {
        console.warn(`[${pkg}]`, "Exports mismatch with derived metadata");
        pkgChanged = true;
        pkgJSON.exports = structuredClone(derivedMetadata.exports);
    }
    return pkgChanged;
};

/**
 * @type { import("../package-lock.json") }
 */
const packageLockJSON = JSON.parse(await fs.promises.readFile("./package-lock.json", "utf8"));
/**
 * @type { import("../package.json") }
 */
const packageJSON = await readPackageJSON();

let globalChanged = false;
console.info(`Start to ${IS_CHECK ? "check" : "sync"} the package.json of packages/`);
const unusedDependencies = new Set(Object.keys(packageJSON.dependencies));
/**
 * @type { Record<string, { pkgPath: string, pkgJSONPath: string, pkgJSON: Awaited<ReturnType<readPackageJSON>> }> }
 */
const packagesList = Object.fromEntries(await Promise.all((await fs.promises.readdir("./packages")).map(async (pkg) => {
    const pkgPath = path.resolve("./packages", pkg);
    return [
        pkg,
        {
            pkgPath,
            pkgJSONPath: await resolvePackageJSON(pkgPath),
            pkgJSON: await readPackageJSON(await resolvePackageJSON(pkgPath)),
        },
    ];
})));
for (const [pkg, { pkgJSONPath, pkgJSON }] of Object.entries(packagesList)) {
    console.info(`[${pkg}]`, `Start to ${IS_CHECK ? "check" : "sync"} package.json`);
    let pkgChanged = syncDerivedMetadata(pkg, pkgJSON);
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
                if (dependencyVersionString !== targetVersion) {
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
    const relevantOverrides = getRelevantOverrides(packageJSON.overrides, pkgJSON);
    if (JSON.stringify(pkgJSON.overrides) !== JSON.stringify(relevantOverrides)) {
        console.warn(`[${pkg}]`, "Overrides mismatch with root package.json");
        pkgChanged = true;
        if (relevantOverrides) {
            pkgJSON.overrides = structuredClone(relevantOverrides);
        } else {
            Reflect.deleteProperty(pkgJSON, "overrides");
        }
    }
    if (pkgChanged) {
        globalChanged = true;
        console.info(`[${pkg}]`, `There are some changes in package.json${IS_CHECK ? "" : ", write it back"}`);
        if (!IS_CHECK) {
            await writePackageJSON(pkgJSONPath, pkgJSON);
        }
    } else {
        console.info(`[${pkg}]`, "There is no change in package.json");
    }
}

console.info("Parsing the scripts to exclude used dependencies");
const dir = (await fs.promises.readdir("./scripts", { withFileTypes: true, recursive: true })).filter((dirent) => dirent.isFile());
for (const file of ["./eslint.config.js", ...dir.map((dirent) => path.resolve(dirent.parentPath, dirent.name))]) {
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
} else if (IS_CHECK) {
    console.error("Package metadata drift detected. Run `npm run sync:packages` to update package.json files.");
    process.exitCode = 1;
} else {
    console.info("Package metadata synchronized.");
}

console.info("Done.");

console.info("-".repeat(73));
