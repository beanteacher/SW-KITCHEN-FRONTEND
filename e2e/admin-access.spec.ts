import { expect, test } from "./fixtures";

// 관리 API 가 403 을 주는 것은 이 테스트가 일부러 만든 상황이다
test.use({ expectedConsoleErrors: [/status of 403/] });

// 고객이 관리 화면 주소로 들어오면 없는 주소와 같은 404 를 보여, 관리 화면이 있다는 것도 드러내지 않는다
test("고객 계정으로 관리 화면에 들어가면 없는 페이지로 보이고 관리 화면 틀도 보이지 않는다", async ({
  page,
}) => {
  // 고객 계정을 만들려면 본인확인이 필요해서, 내 정보 응답만 고객으로 바꿔 끼운다
  // 내 정보를 확인하는 동안 숨겨 그려 둔 화면이 관리 API 를 부르도록, 응답을 조금 늦게 준다
  await page.route("**/api/v1/auth/me", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.fulfill({
      json: {
        success: true,
        data: { id: 9999, userId: "customer", name: "고객", role: "CUSTOMER" },
        message: null,
        timestamp: new Date().toISOString(),
      },
    });
  });

  // 관리 API 는 실제 서버처럼 403 으로 답한다. 이때 권한 없음 안내도 뜨면 안 된다
  await page.route("**/api/v1/admin/**", (route) =>
    route.fulfill({
      status: 403,
      json: { success: false, code: "FORBIDDEN", message: "권한이 없습니다.", timestamp: "" },
    }),
  );

  await page.goto("/admin/product");
  // 권한 없음 안내는 403 을 받은 뒤 언제든 잠깐(3초) 떴다 사라진다. 들어온 뒤 3초 동안 한 번도 뜨지 않아야 한다
  const permissionToastShown = page
    .getByText(/권한이 없습니다/)
    .waitFor({ timeout: 3000 })
    .then(
      () => true,
      () => false,
    );

  await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다." })).toBeVisible();
  await expect(page.getByRole("link", { name: /관리/ })).toHaveCount(0);
  expect(await permissionToastShown).toBe(false);
});
