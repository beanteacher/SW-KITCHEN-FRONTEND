import { expect, login, test } from "./fixtures";

// 오류 화면. 없는 주소는 응답 자체가 404 라 브라우저가 콘솔에 남긴다
test.use({ expectedConsoleErrors: [/status of 404/] });

test("없는 주소는 쇼핑몰 틀 안에서 404 안내와 [신제품 보러 가기]를 보여 준다", async ({ page }) => {
  const response = await page.goto("/no-such-page");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다." })).toBeVisible();
  await expect(page.getByText("입력한 주소를 다시 확인해 주세요.")).toBeVisible();
  // 머리글이 있어 메뉴·검색으로 바로 다른 곳에 갈 수 있다
  await expect(page.getByRole("banner").getByRole("searchbox", { name: "검색어" })).toBeVisible();

  await page.getByRole("link", { name: "신제품 보러 가기" }).click();
  await expect(page).toHaveURL(/\/product\/new$/);
});

test.describe("이전 화면", () => {
  // 머리글이 내 정보를 묻는 도중에 뒤로 가면 Safari 가 끊긴 요청을 콘솔에 남긴다
  test.use({ expectedConsoleErrors: [/status of 404|due to access control checks/] });

  test("[이전 화면으로]는 들어오기 전 화면으로 돌아간다", async ({ page }) => {
    await page.goto("/product/stock");
    await page.goto("/no-such-page");

    await page.getByRole("button", { name: "이전 화면으로" }).click();

    await expect(page).toHaveURL(/\/product\/stock$/);
  });
});

test.describe("관리 화면", () => {
  test("직원이 없는 관리 주소로 들어오면 관리 틀 안에서 404 를 보이고, 버튼은 [이전 화면] 하나다", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/admin/no-such-menu");

    await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다." })).toBeVisible();
    await expect(page.getByText("왼쪽 메뉴에서 이동해 주세요.")).toBeVisible();
    // 관리 틀(왼쪽 메뉴)은 그대로다
    await expect(page.getByRole("link", { name: "제품 관리" })).toBeVisible();
    await expect(page.getByRole("main").getByRole("button")).toHaveText(["이전 화면"]);
    await expect(page.getByRole("main").getByRole("link")).toHaveCount(0);

    await page.getByRole("button", { name: "이전 화면" }).click();
    await expect(page).toHaveURL(/\/admin\/product$/);
  });
});

test.describe("500 화면 (개발 중에만 열리는 오류 주소)", () => {
  // 일부러 던진 오류를 브라우저·Next 가 콘솔에 남긴다
  test.use({
    expectedConsoleErrors: [/status of 500|일부러 낸 오류/],
  });

  test("쇼핑몰 안에서 나면 머리글은 두고 본문에 [다시 시도] [쇼핑몰 첫 화면]을 보인다", async ({
    page,
  }) => {
    await page.goto("/dev-error");

    await expect(page.getByRole("heading", { name: "잠시 문제가 생겼습니다." })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("searchbox", { name: "검색어" })).toBeVisible();
    await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();

    await page.getByRole("link", { name: "쇼핑몰 첫 화면" }).click();
    await expect(page).toHaveURL(/\/product\/new$/);
  });

  test("쇼핑몰 밖에서 나도 같은 안내를 보인다", async ({ page }) => {
    await page.goto("/dev-preview/error");

    await expect(page.getByRole("heading", { name: "잠시 문제가 생겼습니다." })).toBeVisible();
    await expect(page.getByText(/계속되면 고객센터/)).toBeVisible();
  });

  test("관리 화면에서 나면 관리 틀 안에 글과 [이전 화면] 하나만 보인다", async ({ page }) => {
    await login(page);
    await page.goto("/admin/dev-error");

    await expect(page.getByRole("heading", { name: "화면을 불러오지 못했습니다." })).toBeVisible();
    await expect(page.getByRole("link", { name: "제품 관리" })).toBeVisible();
    await expect(page.getByRole("main").getByRole("button")).toHaveText(["이전 화면"]);

    await page.getByRole("button", { name: "이전 화면" }).click();
    await expect(page).toHaveURL(/\/admin\/product$/);
  });
});
