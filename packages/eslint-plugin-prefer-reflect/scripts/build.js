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

// 生成 meta 信息文件，用于 ESLint flat config 兼容性
// 参见 https://eslint.org/docs/latest/extend/plugin-migration-flat-config
// 使用普通 JS 模块导出，tsc 可同时正确转换到 ESM 和 CJS
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
// 从 @annangela/eslint-plugin-prefer-reflect 推导 namespace: @annangela/prefer-reflect
const namespace = `@${pkg.name.split("/")[0].replace(/^@/, "")}/${pkg.name.split("/")[1].replace(/^eslint-plugin-/, "")}`;
const metaContent = [
    "// 此文件由 scripts/build.js 自动生成，请勿手动编辑",
    "// 参见 https://eslint.org/docs/latest/extend/plugin-migration-flat-config",
    `export const name = ${JSON.stringify(pkg.name)};`,
    `export const namespace = ${JSON.stringify(namespace)};`,
    `export const version = ${JSON.stringify(pkg.version)};`,
    "",
].join("\n");
fs.writeFileSync("./src/meta.generated.js", metaContent);
console.info("\tGenerated src/meta.generated.js");

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
await execCommand("tree --du -afNshv dist", {
    synchronousStderr: true,
    synchronousStdout: true,
});

console.info("Done.");
