import { expect, test as base } from "@playwright/test";

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
