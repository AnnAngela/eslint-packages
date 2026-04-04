import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
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

/**
 * @param { string } command
 * @param { string[] } args
 * @param { { cwd: string, synchronousStdout?: boolean, synchronousStderr?: boolean } } options
 */
const runCommand = (command, args, options) => new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, {
        cwd: options.cwd,
        stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    childProcess.stdout?.on("data", (chunk) => {
        const text = chunk.toString("utf8");
        stdout += text;
        if (options.synchronousStdout) {
            process.stdout.write(text);
        }
    });
    childProcess.stderr?.on("data", (chunk) => {
        const text = chunk.toString("utf8");
        stderr += text;
        if (options.synchronousStderr) {
            process.stderr.write(text);
        }
    });
    childProcess.on("error", reject);
    childProcess.on("close", (code, signal) => {
        if (code === 0) {
            resolve({ stdout, stderr });
            return;
        }
        const error = new Error(signal
            ? `${command} exited with signal ${signal}`
            : `${command} exited with code ${code ?? "unknown"}`);
        Reflect.set(error, "code", code);
        Reflect.set(error, "stdout", stdout);
        Reflect.set(error, "stderr", stderr);
        reject(error);
    });
});

const changesetDir = await fs.promises.readdir(path.join(repoRoot, ".changeset"));
const changesetFiles = changesetDir.filter((file) => file.endsWith(".md") && file !== "README.md");
const hasPendingChangesets = changesetFiles.length > 0;

if (hasPendingChangesets) {
    await runCommand("npx", [
        "--yes",
        "@changesets/cli@2.30.0",
        "status",
        `--output=${path.join(os.tmpdir(), "changeset-status.json")}`,
    ], {
        cwd: repoRoot,
        synchronousStdout: true,
        synchronousStderr: true,
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
        await runCommand("npm", [
            "view",
            `${pkg.name}@${pkg.version}`,
            "version",
            "--json",
        ], {
            cwd: repoRoot,
        });
    } catch (error) {
        const npmViewOutput = extractCommandOutput(/** @type { NodeJS.ErrnoException & { stdout?: string | Buffer, stderr?: string | Buffer } } */(error));

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
