import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

// 로컬 첫 관리자 계정. DB 에 다른 비밀번호로 만들어져 있으면 E2E_PASSWORD 로 넘긴다
const USER_ID = process.env.E2E_USER_ID ?? "admin";
const PASSWORD = process.env.E2E_PASSWORD ?? "1234";

const headerButton = (page: Page) =>
  page
    .getByRole("banner")
    .getByRole("link", { name: "로그인" })
    .or(page.getByRole("banner").getByRole("button", { name: "로그아웃" }));

async function login(page: Page, path = "/login") {
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

test("로그인 전 쇼핑몰 머리글은 [로그인 / 회원가입]", async ({ page }) => {
  await page.goto("/product/new");

  await expect(headerButton(page)).toHaveText(/로그인/);
});

test("틀린 비밀번호는 한 줄 안내 후 비밀번호 칸을 비운다", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("아이디").fill(USER_ID);
  await page.getByLabel("비밀번호", { exact: true }).fill("wrong-password");
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page.getByText("아이디 또는 비밀번호가 맞지 않습니다.")).toBeVisible();
  await expect(page.getByLabel("비밀번호", { exact: true })).toHaveValue("");
});

test("로그인하면 관리 화면으로 가고, 새로고침해도 로그인이 유지된다", async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(/\/admin\/product$/);

  await page.reload();

  await expect(page.getByText(`${USER_ID} · 관리자`)).toBeVisible();
});

test("로그인한 뒤 쇼핑몰 머리글은 [로그아웃]", async ({ page }) => {
  await login(page);
  await page.goto("/product/new");

  await expect(headerButton(page)).toHaveText("로그아웃");
});

test("액세스 토큰이 만료돼도 리프레시 토큰으로 이어서 쓴다", async ({ page, context }) => {
  await login(page);
  // 30분이 지난 상황: 액세스 토큰만 없앤다
  await context.clearCookies({ name: "access_token" });

  await page.goto("/admin/category");

  await expect(page.getByRole("heading", { name: "분류 관리" })).toBeVisible();
  expect((await context.cookies()).map((cookie) => cookie.name)).toContain("access_token");
});

test("로그아웃하면 쿠키가 지워지고, 관리 화면은 로그인 화면으로 보낸다", async ({
  page,
  context,
}) => {
  await login(page);
  await page.goto("/product/new");

  // 로그아웃 뒤 첫 화면을 다시 불러온다. 그 응답이 오기 전에 다른 화면으로 가면 브라우저가 요청을 끊는다
  const reloaded = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/product/new" &&
      response.request().headers()["rsc"] === "1",
  );
  await page.getByRole("banner").getByRole("button", { name: "로그아웃" }).click();
  await reloaded;

  await expect(headerButton(page)).toHaveText(/로그인/);
  expect(await context.cookies()).toHaveLength(0);
  await page.goto("/admin/product");
  await expect(page).toHaveURL(/\/login\?redirect=%2Fadmin%2Fproduct$/);
});

test("돌아갈 주소가 있으면 로그인 뒤 그 화면으로 간다", async ({ page }) => {
  await login(page, "/login?redirect=%2Fadmin%2Fcategory");

  await expect(page).toHaveURL(/\/admin\/category$/);
});
