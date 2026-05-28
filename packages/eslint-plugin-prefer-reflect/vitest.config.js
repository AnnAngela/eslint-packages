import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        cacheDir: "../../.cache/.vitest/eslint-plugin-prefer-reflect",
        coverage: {
            provider: "v8",
            include: ["src/**/*.js"],
            thresholds: {
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100,
            },
        },
    },
});
