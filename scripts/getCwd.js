import fs from "node:fs";
import path from "node:path";
import { setOutput } from "@actions/core";

const input = process.env.INPUT;
const cwd = path.join("./packages", input.replace(/^@[^/]+/, "").replace(/@[v\d.]+$/, ""));
console.info(cwd);
await fs.promises.access(cwd);
setOutput("cwd", cwd);
