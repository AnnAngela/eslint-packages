console.info("-".repeat(73));

import fs from "node:fs";
import path from "node:path";
import { readPackageJSON, resolvePackageJSON, writePackageJSON } from "pkg-types";
import { parse } from "yaml";

const SET_GHA_OUTPUT = process.env.SET_GHA_OUTPUT === "true";
const IS_CHECK = process.argv.includes("--check") || process.argv.includes("--dry-run");
const defaultRepository = {
    type: "git",
    url: "git+https://github.com/AnnAngela/eslint-packages.git",
};

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
                "import": "./dist/esm/index.js",
                require: "./dist/cjs/index.js",
            },
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
                "import": "./dist/esm/index.js",
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
        pkgJSON.repository ??= structuredClone(defaultRepository);
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
 * Parse pnpm-lock.yaml to extract resolved versions for dependencies.
 * @returns { Record<string, string> }
 */
const parsePnpmLockfile = async () => {
    const lockfile = parse(await fs.promises.readFile("./pnpm-lock.yaml", "utf8"));
    /** @type { Record<string, string> } */
    const result = {};

    // Extract versions from root importer
    const rootImporter = lockfile.importers?.["."];
    if (rootImporter) {
        for (const section of ["dependencies", "devDependencies", "optionalDependencies"]) {
            const deps = rootImporter[section];
            if (!deps) {
                continue;
            }
            for (const [name, info] of Object.entries(deps)) {
                if (typeof info.version === "string") {
                    result[name] = info.version.replace(/\(.+\)$/, "").replace(/_.*$/, "");
                }
            }
        }
    }

    // Fallback: extract from packages section
    if (lockfile.packages) {
        for (const key of Object.keys(lockfile.packages)) {
            const atIndex = key.lastIndexOf("@");
            if (atIndex <= 0) {
                continue;
            }
            const pkgName = key.slice(0, atIndex);
            const version = key.slice(atIndex + 1).replace(/\(.+\)$/, "").replace(/_.*$/, "");
            if (!result[pkgName]) {
                result[pkgName] = version;
            }
        }
    }

    return result;
};

const pnpmLockVersions = await parsePnpmLockfile();
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
            // 跳过 workspace: 协议依赖 —— pnpm 在 publish 时自动处理版本替换，
            // 将其转为 npm 版本范围会破坏本地 workspace 链接能力
            if (/^workspace:/.test(dependencyVersionString)) {
                continue;
            }
            // 跳过 catalog: 协议依赖 —— 版本由 pnpm-workspace.yaml 集中管理，
            // 覆盖为 lockfile 版本会破坏 catalog: 引用模式
            if (/^catalog:/.test(dependencyVersionString)) {
                continue;
            }
            const lockVersion = pnpmLockVersions[dependencyName];
            if (typeof lockVersion === "string") {
                const targetVersion = `^${lockVersion}`;
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
    console.error("Package metadata drift detected. Run `pnpm run sync:packages` to update package.json files.");
    // SET_GHA_OUTPUT 环境变量：仅输出 need_sync=true，不改变退出码，由后续 step 自行决策
    if (!SET_GHA_OUTPUT) {
        process.exitCode = 1;
    }
} else {
    console.info("Package metadata synchronized.");
}

// 若 SET_GHA_OUTPUT 环境变量为 true 且检测到需要修改，则向 GitHub Actions 输出 need_sync=true
if (SET_GHA_OUTPUT && globalChanged) {
    const ghaOutputPath = process.env.GITHUB_OUTPUT;
    if (ghaOutputPath) {
        await fs.promises.appendFile(ghaOutputPath, "need_sync=true\n");
        console.info("Set GHA output need_sync=true");
    } else {
        console.warn("$GITHUB_OUTPUT is not set, cannot write GHA output. Are you running in a GitHub Actions environment?");
    }
}

console.info("Done.");

console.info("-".repeat(73));
