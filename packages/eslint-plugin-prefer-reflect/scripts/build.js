import fs from "node:fs";
import execCommand from "../../../scripts/modules/spawnChildProcess.js";

console.info("Preparing to build...");
for (const dir of [
    "dist",
]) {
    console.info("\tDeleting", dir, "...");
    await fs.promises.rm(dir, {
        force: true,
        recursive: true,
    });
    console.info("\tMaking", dir, "...");
    await fs.promises.mkdir(dir, {
        recursive: true,
    });
}

console.info("Building ESM files ...");
await execCommand("tsc --project tsconfig.json", {
    synchronousStderr: true,
    synchronousStdout: true,
});

console.info("Building CommonJS module ...");
await execCommand("tsc --project tsconfig.cjs.json", {
    synchronousStderr: true,
    synchronousStdout: true,
});

console.info("Marking dist/cjs as CommonJS module ...");
await fs.promises.writeFile("dist/cjs/package.json", JSON.stringify({ type: "commonjs" }), {
    encoding: "utf-8",
});

console.info("Result:");
await execCommand("tree -afNshv dist", {
    synchronousStderr: true,
    synchronousStdout: true,
});

console.info("Done.");
