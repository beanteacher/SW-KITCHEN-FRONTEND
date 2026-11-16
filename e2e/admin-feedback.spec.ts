import { expect, login, test } from "./fixtures";

// 관리 화면 알림: 실패는 제자리에 남는 빨간 안내, 나가기 확인은 브라우저 창이 아닌 우리 확인 창

test("제품 등록: 빈 채로 [적용]을 누르면 그 줄 안에 남는 안내를 보이고, 칸을 채우면 지운다", async ({
  page,
}) => {
  await login(page);
  await page.getByRole("link", { name: "제품 관리" }).click();
  await page.getByRole("link", { name: "+ 제품 등록" }).click();

  await page.getByRole("button", { name: "적용" }).click();
  const bulkError = page.getByRole("alert").filter({ hasText: "넣을 값을 먼저 입력해 주세요." });
  await expect(bulkError).toBeVisible();
  // 사라지는 알림이 아니다
  await page.waitForTimeout(3500);
  await expect(bulkError).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("제품 등록: 고친 채로 [취소]를 누르면 우리 확인 창으로 묻고, [나가기]로 목록에 간다", async ({
  page,
}) => {
  await login(page);
  await page.getByRole("link", { name: "제품 관리" }).click();
  await page.getByRole("link", { name: "+ 제품 등록" }).click();
  await page.getByLabel("제품명").fill("나가기 확인용");
  // 브라우저 기본 창이 뜨면 적어 두고 마지막에 실패시킨다 (이벤트 안에서 던지면 테스트가 멈출 수 있다)
  const nativeDialogs: string[] = [];
  page.on("dialog", (dialog) => {
    nativeDialogs.push(dialog.message());
    void dialog.dismiss();
  });

  await page.getByRole("button", { name: "취소" }).click();
  const ask = page.getByRole("dialog", { name: "저장하지 않고 나갈까요?" });
  await expect(ask).toContainText("저장하지 않은 내용은 사라집니다.");
  await ask.getByRole("button", { name: "나가기" }).click();

  await expect(page).toHaveURL(/\/admin\/product$/);
  expect(nativeDialogs, "브라우저 기본 확인 창").toEqual([]);
});

test.describe("분류 순서 바꾸기 실패", () => {
  // 일부러 500 을 준다
  test.use({ expectedConsoleErrors: [/status of 500/] });

  test("순서를 바꾸다 서버 오류가 나면 표 위에 남는 빨간 안내를 보인다", async ({ page }) => {
    await login(page);
    // 대분류 둘을 보여 주고, 순서 저장은 서버 오류로 답한다
    const big = (id: number, name: string, abbr: string) => ({
      id,
      name,
      abbr,
      sortOrder: id,
      productCount: 0,
      children: [],
    });
    await page.route("**/api/v1/admin/category", (route) =>
      route.request().method() === "GET"
        ? route.fulfill({
            json: {
              success: true,
              data: [big(990001, "시험 대분류 1", "XA"), big(990002, "시험 대분류 2", "XB")],
              message: null,
              timestamp: "",
            },
          })
        : route.fallback(),
    );
    await page.route("**/api/v1/admin/category/order", (route) =>
      route.fulfill({
        status: 500,
        json: {
          success: false,
          code: "INTERNAL_ERROR",
          message: "순서를 바꾸지 못했습니다. 잠시 뒤 다시 시도해 주세요.",
          timestamp: "",
        },
      }),
    );
    await page.getByRole("link", { name: "분류 관리" }).click();

    await page.getByRole("button", { name: "시험 대분류 2 위로" }).click();

    const notice = page.getByRole("alert").filter({ hasText: "순서를 바꾸지 못했습니다." });
    await expect(notice).toBeVisible();
    await page.waitForTimeout(3500);
    await expect(notice).toBeVisible();
  });
});
