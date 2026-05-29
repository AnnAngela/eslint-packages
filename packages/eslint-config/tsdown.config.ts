import fs from "node:fs/promises";

import { defineConfig } from "tsdown";

export default defineConfig({
    entry: [
        "./src/index.js",
    ],
    tsconfig: "./tsconfig.json",
    dts: true,
    sourcemap: true,
    clean: true,
    format: {
        esm: {
            outDir: "dist/esm",
        },
        cjs: {
            outDir: "dist/cjs",
        },
    },
    outExtensions: () => ({
        js: ".js",
        dts: ".d.ts",
    }),
    copy: [
        {
            from: "src/tsconfigs/*",
            to: "dist/tsconfigs",
        },
    ],
    hooks: {
        "build:done": async ({ format }) => {
            if (format !== "cjs") {
                return;
            }

            await fs.writeFile("dist/cjs/package.json", JSON.stringify({ type: "commonjs" }), {
                encoding: "utf-8",
            });
        },
    },
});
