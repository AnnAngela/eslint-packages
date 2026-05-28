import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        cacheDir: "../../.cache/.vitest/eslint-formatter-gha",
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            thresholds: {
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100,
            },
        },
    },
});
