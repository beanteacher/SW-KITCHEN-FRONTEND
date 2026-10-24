import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // e2e/ 는 Playwright 가 돌린다
    exclude: ["e2e/**", "node_modules/**"],
  },
});
