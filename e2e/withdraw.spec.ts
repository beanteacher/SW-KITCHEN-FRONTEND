import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

// 고객 계정은 본인확인이 있어야 만들어져서, 고객 응답을 바꿔 끼운다. 탈퇴하면 서버는 쿠키를 지우고 내 정보는 401 이 된다
async function fakeCustomer(page: Page) {
  let withdrawn = false;
  const ok = (data: unknown) => ({
    json: { success: true, data, message: null, timestamp: new Date().toISOString() },
  });
  await page.route("**/api/v1/auth/me", (route) =>
    withdrawn
      ? route.fulfill({
          status: 401,
          json: { success: false, code: "UNAUTHORIZED", message: "", timestamp: "" },
        })
      : route.fulfill(ok({ id: 9999, userId: "customer", name: "고객", role: "CUSTOMER" })),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({
      status: 401,
      json: { success: false, code: "UNAUTHORIZED", message: "", timestamp: "" },
    }),
  );
  await page.route("**/api/v1/member/me", (route) =>
    route.fulfill(
      ok({ userId: "customer", name: "고객", phone: "01000000000", hasPassword: true }),
    ),
  );
  await page.route("**/api/v1/member/me/withdraw", (route) => {
    withdrawn = true;
    return route.fulfill(ok(null));
  });
}

test("탈퇴 창은 닫았다 다시 열면 넣던 비밀번호가 비어 있다", async ({ page }) => {
  await fakeCustomer(page);
  await page.goto("/my");
  const dialog = page.getByRole("dialog", { name: "회원 탈퇴" });

  await page.getByRole("button", { name: "회원 탈퇴" }).click();
  await dialog.getByLabel("비밀번호 확인").fill("typed-password");
  await dialog.getByRole("button", { name: "취소" }).click();
  await page.getByRole("button", { name: "회원 탈퇴" }).click();

  await expect(dialog.getByLabel("비밀번호 확인")).toHaveValue("");
});

test("탈퇴하면 완료 화면을 보여 주고, 쇼핑몰로 가면 머리글이 바로 [로그인 / 회원가입] 이다", async ({
  page,
}) => {
  await fakeCustomer(page);
  await page.goto("/my");
  const header = page.getByRole("banner");
  await expect(header.getByRole("button", { name: "로그아웃" })).toBeVisible();

  await page.getByRole("button", { name: "회원 탈퇴" }).click();
  const dialog = page.getByRole("dialog", { name: "회원 탈퇴" });
  await dialog.getByLabel("비밀번호 확인").fill("password1!");
  await dialog.getByRole("button", { name: "탈퇴하기" }).click();

  await expect(page).toHaveURL(/\/withdrawn$/);
  await expect(page.getByRole("heading", { name: "탈퇴했습니다" })).toBeVisible();
  await expect(page.getByText(/주문 기록은 정해진 기간 동안/)).toBeVisible();

  await page.getByRole("link", { name: "쇼핑몰로 가기" }).click();
  await expect(header.getByRole("link", { name: /로그인/ })).toBeVisible();
  await expect(header.getByRole("button", { name: "로그아웃" })).toHaveCount(0);
});

test.describe("마케팅 수신", () => {
  // 실패 경우는 일부러 500 을 준다
  test.use({ expectedConsoleErrors: [/status of 500/] });

  test("마케팅 수신을 바꾸면 보낸 곳·날짜·결과를 줄 아래에 남기고, 실패하면 빨간 글씨로 남긴다", async ({
    page,
  }) => {
    await fakeCustomer(page);
    let fail = false;
    await page.route("**/api/v1/member/me/marketing", (route) =>
      fail
        ? route.fulfill({
            status: 500,
            json: {
              success: false,
              code: "INTERNAL_ERROR",
              message: "바꾸지 못했습니다. 잠시 뒤 다시 시도해 주세요.",
              timestamp: "",
            },
          })
        : route.fulfill({ json: { success: true, data: null, message: null, timestamp: "" } }),
    );
    await page.goto("/my");
    const marketing = page.getByRole("switch", { name: /마케팅/ });

    await marketing.click();
    await expect(
      page.getByRole("status").filter({ hasText: "성원종합주방 마케팅 정보 수신 동의가" }),
    ).toContainText(/\d{4}\.\d{2}\.\d{2}에 처리되었습니다/);
    // 4초 뒤에도 남아 있다 (사라지는 알림이 아니다)
    await page.waitForTimeout(4000);
    await expect(page.getByText(/마케팅 정보 수신 동의가/)).toBeVisible();

    fail = true;
    await marketing.click();
    await expect(page.getByRole("alert").filter({ hasText: "바꾸지 못했습니다" })).toBeVisible();
  });
});
