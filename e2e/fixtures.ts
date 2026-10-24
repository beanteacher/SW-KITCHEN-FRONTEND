import { expect, test as base, type Page } from "@playwright/test";

// 로컬 첫 관리자 계정. DB 에 다른 비밀번호로 만들어져 있으면 E2E_PASSWORD 로 넘긴다
export const USER_ID = process.env.E2E_USER_ID ?? "admin";
const PASSWORD = process.env.E2E_PASSWORD ?? "1234";

export async function login(page: Page, path = "/login") {
  await page.goto(path);
  await page.getByLabel("아이디").fill(USER_ID);
  await page.getByLabel("비밀번호", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  // 처음 받은 비밀번호면 안내 창이 뜬다. 닫으면 이동한다
  const notice = page.getByRole("dialog", { name: "비밀번호 변경 권장" });
  if (await notice.isVisible({ timeout: 1500 }).catch(() => false)) {
    await notice.getByRole("button", { name: "확인" }).click();
  }
  // 이동이 끝나야 쿠키가 저장된 것이다. 그 전에 다른 화면으로 가면 로그인 요청이 끊긴다
  await page.waitForURL((url) => url.pathname !== "/login");
}

// 로그인 안 한 상태에서 내 정보·재발급이 401 을 받는 건 정상 흐름이다. 브라우저가 이걸 콘솔 오류로 남긴다
const EXPECTED = [/Failed to load resource: the server responded with a status of 401/];

// 모든 테스트에서 브라우저 콘솔 오류·화면 오류가 하나라도 나오면 실패시킨다 (Next 개발 오버레이 오류 포함)
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        if (EXPECTED.some((pattern) => pattern.test(message.text()))) return;
        errors.push(`${new URL(page.url()).pathname}: ${message.text().split("\n")[0]}`);
      });
      page.on("pageerror", (error) =>
        errors.push(`${new URL(page.url()).pathname}: ${error.message}`),
      );

      await use(errors);

      expect(errors, "브라우저 콘솔 오류").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
