import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repoRoot = process.cwd();
const notFoundPatterns = [
    /\bnpm ERR!\s+code\s+E404\b/i,
    /\bcode:?\s*['"]?E404['"]?\b/i,
    /\bnpm ERR!\s+404\b.*\bNot Found\b/i,
    /\bnot in this registry\b/i,
    /\bis not in the npm registry\b/i,
];

/**
 * @param { unknown } output
 */
const normalizeOutput = (output) => {
    if (typeof output === "string") {
        return output;
    }
    return output?.toString?.("utf8") ?? "";
};

/**
 * @param { NodeJS.ErrnoException & { stdout?: string | Buffer, stderr?: string | Buffer } } error
 */
const extractCommandOutput = (error) => {
    const stderr = normalizeOutput(error?.stderr);
    const message = typeof error?.message === "string" ? error.message : String(error);

    return `${stderr}\n${message}`.trim();
};

/**
 * @param { string } output
 */
const isNotFoundResponse = (output) => notFoundPatterns.some((pattern) => pattern.test(output));

const changesetFiles = (await fs.promises.readdir(path.join(repoRoot, ".changeset")))
    .filter((file) => file.endsWith(".md") && file !== "README.md");
const hasPendingChangesets = changesetFiles.length > 0;

if (hasPendingChangesets) {
    await execFileAsync("npx", [
        "--yes",
        "@changesets/cli@2.30.0",
        "status",
        "--output=/tmp/changeset-status.json",
    ], {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024,
    });
    console.log("Pending changesets detected.");
} else {
    console.log("No pending changesets found.");
}

const packageJsonFiles = (await fs.promises.readdir(path.join(repoRoot, "packages"), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(repoRoot, "packages", entry.name, "package.json"));
const unpublishedPackages = [];

for (const packageJsonFile of packageJsonFiles) {
    const pkg = JSON.parse(await fs.promises.readFile(packageJsonFile, "utf8"));

    if (pkg.private === true) {
        continue;
    }

    try {
        await execFileAsync("npm", [
            "view",
            `${pkg.name}@${pkg.version}`,
            "version",
            "--json",
        ], {
            cwd: repoRoot,
            maxBuffer: 1024 * 1024,
        });
    } catch (error) {
        const npmViewOutput = extractCommandOutput(/** @type { NodeJS.ErrnoException & { stdout?: string | Buffer, stderr?: string | Buffer } } */ (error));

        if (isNotFoundResponse(npmViewOutput)) {
            unpublishedPackages.push({ name: pkg.name, version: pkg.version });
            continue;
        }

        throw new Error(`Failed to query npm for ${pkg.name}@${pkg.version}: ${npmViewOutput || "unknown npm view error"}`);
    }
}

if (unpublishedPackages.length > 0) {
    console.log("Unpublished package versions detected:");
    console.log(JSON.stringify(unpublishedPackages, null, 2));
} else {
    console.log("No unpublished package versions found.");
}

const shouldRun = hasPendingChangesets || unpublishedPackages.length > 0;

if (process.env.GITHUB_OUTPUT) {
    await fs.promises.appendFile(process.env.GITHUB_OUTPUT, `${[
        `has-pending-changesets=${hasPendingChangesets}`,
        `has-unpublished-packages=${unpublishedPackages.length > 0}`,
        `should-run=${shouldRun}`,
    ].join("\n")}\n`, "utf8");
} else {
    console.warn("GITHUB_OUTPUT is not set; skipping workflow output export.");
}
