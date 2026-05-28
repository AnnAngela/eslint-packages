import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // 缓存目录
        cacheDir: ".cache/.vitest",
        // 覆盖率配置
        coverage: {
            provider: "v8",
            thresholds: {
                // 全局 100% 覆盖率要求
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100,
            },
        },
    },
});
