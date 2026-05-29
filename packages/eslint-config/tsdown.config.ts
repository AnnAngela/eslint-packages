import { defineConfig } from "tsdown";

export default defineConfig({
    entry: {
        index: "./build-entry.ts",
    },
    tsconfig: "./tsconfig.build.json",
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
    outputOptions: (options, format) => ({
        ...options,
        exports: format === "cjs" ? "named" : options.exports,
    }),
    copy: [
        {
            from: "src/tsconfigs/*",
            to: "dist/tsconfigs",
        },
        {
            from: "cjs.package.json",
            to: "dist/cjs/package.json",
        },
    ],
});
