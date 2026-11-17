import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

// 눈으로 보며 돌릴 때(E2E_WATCH=1) 쓰는 Chrome. 테스트 밖에서 한 번 띄워 두고 테스트는 여기에 붙는다.
// Playwright 가 띄운 브라우저는 테스트가 실패할 때마다 닫혔다 다시 떠서, 창이 계속 깜빡였다
export const WATCH_BROWSER_URL = "http://127.0.0.1:9222";

const isUp = () =>
  fetch(`${WATCH_BROWSER_URL}/json/version`).then(
    () => true,
    () => false,
  );

// 이미 떠 있으면 그 창을 그대로 쓴다. 자리·크기는 E2E_WINDOW="x,y,너비,높이" (기본은 터미널 자리)
export default async function startWatchBrowser() {
  if (await isUp()) return;
  const [x, y, width, height] = (process.env.E2E_WINDOW ?? "8,55,849,949").split(",");
  // 평소 쓰는 Chrome 을 테스트 전용 프로필로 새로 띄운다. open 으로 띄워야 앞으로 나와 보인다
  spawn(
    "open",
    [
      "-na",
      "Google Chrome",
      "--args",
      "--remote-debugging-port=9222",
      `--user-data-dir=${join(tmpdir(), "sw-kitchen-e2e-chrome")}`,
      `--window-position=${x},${y}`,
      `--window-size=${width},${height}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { detached: true, stdio: "ignore" },
  ).unref();
  for (let i = 0; i < 50; i++) {
    if (await isUp()) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("E2E 용 Chrome 이 뜨지 않았습니다");
}
