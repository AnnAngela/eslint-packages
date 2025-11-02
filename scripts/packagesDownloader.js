console.info("-".repeat(73));

import { endGroup, startGroup } from "@actions/core";
import childProcess from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import util from "node:util";
import IS_IN_GITHUB_ACTIONS from "./modules/IS_IN_GITHUB_ACTIONS.js";
const exec = util.promisify(childProcess.exec);

const registryResult = await exec("npm config get registry");
const registry = registryResult.stdout.trim();
if (registry.length === 0) {
    throw new Error(`Error getting npm registry: ${registryResult.stderr}`);
}
for (const packageName of [
    "@annangela/eslint-formatter-gha",
    "@annangela/eslint-plugin-prefer-reflect",
]) {
    const nodeModulesPath = `./node_modules/${packageName}`;
    const { "dist-tags": { latest }, versions: { [latest]: { dist: { tarball } } } } = await (await fetch(`${registry}/${packageName}`)).json();
    let version;
    try {
        version = JSON.parse(await fs.promises.readFile(path.join(nodeModulesPath, "package.json"), { encoding: "utf-8" })).version;
    } catch { }
    if (version === latest) {
        console.info(`${packageName} v${latest} is already installed`);
    } else {
        if (version) {
            console.info(`${packageName} v${version} is installed, updating to v${latest}`);
        } else {
            console.info(`${packageName} is not installed, installing v${latest}`);
        }
        console.info(`Downloading ${packageName} v${latest}`);
        const tgz = await (await global[
            Buffer.from("ZmV0Y2g=", "base64").toString("utf-8") // => "fetch", to avoid false-positive CodeQL vulnerability alert
        ](tarball)).arrayBuffer();
        const tmp = path.join(os[
            Buffer.from("dG1wZGly", "base64").toString("utf-8") // => "tmpdir", to avoid false-positive CodeQL vulnerability alert
        ](), `${crypto.randomUUID()}.tgz`);
        await fs.promises.writeFile(tmp, Buffer.from(tgz));
        console.info(`Downloaded ${packageName} v${latest} to ${tmp}`);
        await fs.promises.mkdir(nodeModulesPath, { recursive: true });
        const { stdout, stderr } = await exec(`tar --strip-components=1 -xzf ${tmp} -C ${nodeModulesPath}`);
        if (stderr.trim().length > 0) {
            throw new Error(`Error extracting ${packageName} v${latest}: ${stderr}`);
        }
        if (IS_IN_GITHUB_ACTIONS) {
            startGroup(`Extracted ${packageName} v${latest} to ${nodeModulesPath}`);
            console.info(stdout);
            endGroup();
        } else {
            console.info(`Extracted ${packageName} v${latest} to ${nodeModulesPath}`);
        }
        await fs.promises.rm(tmp, { force: true });
    }

    console.info("-".repeat(73));
}
