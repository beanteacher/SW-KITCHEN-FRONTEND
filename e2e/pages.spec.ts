import { expect, test } from "./fixtures";

// 모든 화면을 한 번씩 열어 그려지는지와 콘솔 오류가 없는지 본다 (콘솔 검사는 fixtures 가 한다)
const PUBLIC_PAGES = [
  ["/product/new", "신제품"],
  ["/product/stock", "재고·중고품"],
  ["/search?keyword=냉장고", "검색 결과"],
  ["/login", "로그인"],
] as const;

for (const [path, heading] of PUBLIC_PAGES) {
  test(`${path} 화면이 오류 없이 뜬다`, async ({ page }) => {
    await page.goto(path);

    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  });
}

test("첫 화면은 신제품 목록으로 보낸다", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/product\/new$/);
});

test("머리글 메뉴로 신제품 ↔ 재고·중고품을 오간다", async ({ page }) => {
  await page.goto("/product/new");

  await page
    .getByRole("navigation", { name: "주 메뉴" })
    .getByRole("link", { name: "재고·중고품" })
    .click();
  await expect(page).toHaveURL(/\/product\/stock$/);
  await page
    .getByRole("navigation", { name: "주 메뉴" })
    .getByRole("link", { name: "신제품" })
    .click();
  await expect(page).toHaveURL(/\/product\/new$/);
});

test("검색창에서 엔터를 누르면 검색 결과로 간다", async ({ page }) => {
  await page.goto("/product/new");

  await page.getByRole("searchbox", { name: "검색어" }).fill("냉장고");
  await page.getByRole("searchbox", { name: "검색어" }).press("Enter");

  await expect(page).toHaveURL(/\/search\?keyword=/);
});
