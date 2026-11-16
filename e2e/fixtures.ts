import {
  type BrowserContext,
  type ConsoleMessage,
  expect,
  test as playwrightTest,
  type Page,
} from "@playwright/test";
import { WATCH_BROWSER_URL } from "./watchBrowser";

// 로컬 첫 관리자 계정. DB 에 다른 비밀번호로 만들어져 있으면 E2E_PASSWORD 로 넘긴다
export const USER_ID = process.env.E2E_USER_ID ?? "admin";
const PASSWORD = process.env.E2E_PASSWORD ?? "1234";

export async function login(page: Page, path = "/login") {
  await page.goto(path);
  await page.getByLabel("아이디").fill(USER_ID);
  await page.getByLabel("비밀번호", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  // 처음 받은 비밀번호면 안내 창이 뜬다. 닫으면 이동한다. 첫 화면을 만드느라 늦게 뜰 수 있어 이동과 창 중 먼저 오는 쪽을 기다린다
  const notice = page.getByRole("dialog", { name: "비밀번호 변경 권장" });
  await Promise.race([
    page.waitForURL((url) => url.pathname !== "/login"),
    notice.waitFor().then(() => notice.getByRole("button", { name: "확인" }).click()),
  ]);
  // 이동이 끝나야 쿠키가 저장된 것이다. 그 전에 다른 화면으로 가면 로그인 요청이 끊긴다
  await page.waitForURL((url) => url.pathname !== "/login");
}

// 로그인 안 한 상태에서 내 정보·재발급이 401 을 받는 건 정상 흐름이다. 브라우저가 이걸 콘솔 오류로 남긴다
const EXPECTED = [/Failed to load resource: the server responded with a status of 401/];

// 눈으로 보며 돌릴 때(E2E_WATCH=1)는 미리 띄운 Chrome 에 붙어 첫 탭 하나에서 이어 간다. 테스트가 실패해도 창은 닫지 않는다.
// 테스트 사이에는 쿠키만 지운다. 다른 사람으로 로그인해 보는 테스트(browser.newPage)만 창이 하나 더 뜬다
const watchTest = playwrightTest.extend<
  object,
  { sharedContext: BrowserContext; sharedPage: Page }
>({
  browser: [
    async ({ playwright }, provide) =>
      provide(await playwright.chromium.connectOverCDP(WATCH_BROWSER_URL)),
    { scope: "worker" },
  ],
  // 미리 띄운 창은 설정의 baseURL 을 모른다. "/login" 같은 짧은 주소를 여기서 앞에 붙여 준다
  // (Playwright 가 새로 만든 창은 baseURL 을 알지만, 작업자가 끝날 때 함께 닫혀서 쓸 수 없다)
  sharedContext: [
    async ({ browser }, provide, workerInfo) => {
      const context = browser.contexts()[0];
      const baseURL = workerInfo.project.use.baseURL;
      const withBase = <T extends object>(target: T, names: string[]) => {
        const methods = target as Record<string, (url: string, ...rest: unknown[]) => unknown>;
        for (const name of names) {
          const original = methods[name].bind(target);
          methods[name] = (url, ...rest) => original(new URL(url, baseURL).href, ...rest);
        }
      };
      withBase(context.request, ["get", "post", "put", "patch", "delete", "head", "fetch"]);
      context.on("page", (page) => withBase(page, ["goto"]));
      context.pages().forEach((page) => withBase(page, ["goto"]));
      await provide(context);
    },
    { scope: "worker" },
  ],
  sharedPage: [
    async ({ sharedContext }, provide) =>
      provide(sharedContext.pages()[0] ?? (await sharedContext.newPage())),
    { scope: "worker" },
  ],
  // 이름이 use 이면 lint 가 React 훅으로 잘못 본다
  context: async ({ sharedContext }, provide) => provide(sharedContext),
  page: async ({ sharedContext, sharedPage }, provide) => {
    await sharedContext.clearCookies();
    await provide(sharedPage);
  },
});
const base = process.env.E2E_WATCH ? watchTest : playwrightTest;

// 모든 테스트에서 브라우저 콘솔 오류·화면 오류가 하나라도 나오면 실패시킨다 (Next 개발 오버레이 오류 포함)
// 일부러 서버 오류를 내는 테스트는 test.use({ expectedConsoleErrors: [...] }) 로 그 오류만 뺀다
export const test = base.extend<{ consoleErrors: string[]; expectedConsoleErrors: RegExp[] }>({
  expectedConsoleErrors: [[], { option: true }],
  consoleErrors: [
    async ({ page, expectedConsoleErrors }, use) => {
      const expected = [...EXPECTED, ...expectedConsoleErrors];
      const errors: string[] = [];
      const onConsole = (message: ConsoleMessage) => {
        if (message.type() !== "error") return;
        if (expected.some((pattern) => pattern.test(message.text()))) return;
        errors.push(`${new URL(page.url()).pathname}: ${message.text().split("\n")[0]}`);
      };
      const onPageError = (error: Error) => {
        if (expected.some((pattern) => pattern.test(error.message))) return;
        errors.push(`${new URL(page.url()).pathname}: ${error.message}`);
      };
      page.on("console", onConsole);
      page.on("pageerror", onPageError);

      await use(errors);

      // 한 창을 이어 쓸 때 다음 테스트로 넘어가지 않게 뗀다
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      expect(errors, "브라우저 콘솔 오류").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
