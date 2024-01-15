import fs from "node:fs";
import path from "node:path";
import exec from "./modules/spawnChildProcess.js";

console.info("Start to test the `package` actions for all packages");
console.info("-".repeat(73));
for (const pkg of await fs.promises.readdir("./packages")) {
    await exec("npm run package", { cwd: path.resolve("./packages", pkg), synchronousStderr: true, synchronousStdout: true });
    console.info("-".repeat(73));
}
