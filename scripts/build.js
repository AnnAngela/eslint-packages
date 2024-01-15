import fs from "node:fs";
import path from "node:path";
import execCommand from "./spawnChildProcess.js";

const scripts = [
    "eslint.config.js",
    "index.js",
    "forkedGlobals.js",
];

console.info("Preparing to build...");
for (const dir of [
    "src",
    "lib",
]) {
    console.info("\tDeleting", dir, "...");
    await fs.promises.rm(dir, {
        force: true,
        recursive: true,
    });
    console.info("\tMaking", dir, "...");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await fs.promises.mkdir(dir, {
        recursive: true,
    });
}
console.info("\tCopying scripts to src/ ...");
for (const file of scripts) {
    await fs.promises.cp(file, path.join("src", file), {
        force: true,
        recursive: true,
    });
}

console.info("Building CommonJS module ...");
await execCommand("tsc --project tsconfig.cjs.json", {
    synchronousStderr: true,
    synchronousStdout: true,
});

console.info("Building declaration files ...");
await execCommand("tsc --project tsconfig.dts.json", {
    synchronousStderr: true,
    synchronousStdout: true,
});

console.info("Copying scripts to lib/ ...");
for (const file of scripts) {
    await fs.promises.cp(file, path.join("lib", file), {
        force: true,
        recursive: true,
    });
}

console.info("Marking lib/cjs as CommonJS module ...");
await fs.promises.writeFile("lib/cjs/package.json", JSON.stringify({ type: "commonjs" }), {
    encoding: "utf-8",
});

console.info("Clean up the src/ ...");
await fs.promises.rm("src", {
    force: true,
    recursive: true,
});

console.info("Result:");
await execCommand("tree -afNshv lib", {
    synchronousStderr: true,
    synchronousStdout: true,
});

console.info("Done.");
