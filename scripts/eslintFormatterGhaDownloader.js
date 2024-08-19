/* eslint-disable security/detect-non-literal-fs-filename */
console.info("-".repeat(73));

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import util from "node:util";
import childProcess from "node:child_process";
const exec = util.promisify(childProcess.exec);

const { "dist-tags": { latest }, versions: { [latest]: { dist: { tarball } } } } = await (await fetch("https://registry.npmjs.org/@annangela/eslint-formatter-gha")).json();
let version;
try {
    version = JSON.parse(await fs.promises.readFile("./node_modules/@annangela/eslint-formatter-gha/package.json", { encoding: "utf-8" })).version;
} catch { }
if (version === latest) {
    console.info(`"@annangela/eslint-formatter-gha" v${latest} is already installed`);
} else {
    if (version) {
        console.info(`"@annangela/eslint-formatter-gha" v${version} is installed, updating to v${latest}`);
    } else {
        console.info(`"@annangela/eslint-formatter-gha" is not installed, installing v${latest}`);
    }
    console.info(`Downloading "@annangela/eslint-formatter-gha" v${latest}`);
    const tgz = await (await fetch(tarball)).arrayBuffer();
    const tmp = path.join(os.tmpdir(), "eslint-formatter-gha.tgz");
    await fs.promises.writeFile(tmp, Buffer.from(tgz));
    console.info(`Downloaded "@annangela/eslint-formatter-gha" v${latest} to ${tmp}`);
    await fs.promises.mkdir("./node_modules/@annangela/eslint-formatter-gha", { recursive: true });
    await exec(`tar --strip-components=1 -xzf ${tmp} -C ./node_modules/@annangela/eslint-formatter-gha`);
    console.info(`Extracted "@annangela/eslint-formatter-gha" v${latest} to ./node_modules/@annangela/eslint-formatter-gha`);
}

console.info("-".repeat(73));
