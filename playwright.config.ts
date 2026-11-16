import { defineConfig, devices } from "@playwright/test";

// E2E_WATCH=1 이면 눈으로 보며 돌린다. 창 하나(e2e/watchBrowser.ts)를 띄워 두고 테스트가 거기에 붙는다
const WATCH = !!process.env.E2E_WATCH;

// 실제 백엔드에 붙어 돌린다. 백엔드(8080)와 DB 는 먼저 켜 둔다. 프론트는 켜져 있으면 그대로 쓰고, 없으면 띄운다
export default defineConfig({
  testDir: "./e2e",
  // 같은 계정으로 로그인·로그아웃하므로 한 번에 하나씩 돌린다
  workers: 1,
  ...(WATCH && { globalSetup: "./e2e/watchBrowser.ts" }),
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  // Safari 는 http://localhost 에서 Secure 쿠키를 버려서 Chrome 과 결과가 달랐다. 둘 다 돌린다
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(WATCH && { viewport: null, deviceScaleFactor: undefined }),
      },
    },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000/login",
    reuseExistingServer: true,
  },
});
