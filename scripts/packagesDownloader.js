/* eslint-disable security/detect-non-literal-fs-filename */
console.info("-".repeat(73));

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import util from "node:util";
import childProcess from "node:child_process";
import crypto from "node:crypto";
const exec = util.promisify(childProcess.exec);
import { startGroup, endGroup } from "@actions/core";
import IS_IN_GITHUB_ACTIONS from "./modules/IS_IN_GITHUB_ACTIONS.js";

const registryResult = await exec("npm config get registry");
if (registryResult.stderr.trim().length > 0) {
    throw new Error(`Error getting npm registry: ${registryResult.stderr}`);
}
const registry = registryResult.stdout.trim();
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
        const tgz = await (await fetch(tarball)).arrayBuffer();
        const tmp = path.join(os.tmpdir(), `${crypto.randomUUID()}.tgz`);
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
