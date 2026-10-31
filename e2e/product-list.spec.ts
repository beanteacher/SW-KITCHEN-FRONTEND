import { expect, login, test } from "./fixtures";

interface Summary {
  id: number;
  name: string;
}

test.beforeEach(async ({ page }) => {
  await login(page, "/login?redirect=/admin/product");
});

test("제품 관리 목록에서 찾고, 조건을 주소에 남기고, 수정 화면으로 간다", async ({ page }) => {
  const response = await page.request.get("/api/v1/admin/product?page=1&size=1", {
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
  const { data } = (await response.json()) as { data: { content: Summary[] } };
  test.skip(data.content.length === 0, "등록한 제품이 있어야 한다");
  const [first] = data.content;

  await expect(page.getByText(/검색 결과 \d+건/)).toBeVisible();
  const row = page.getByRole("row").filter({ hasText: `#${first.id}` });
  await expect(row).toBeVisible();

  // 검색어는 Enter 로 찾고 주소에 남는다
  await page.getByLabel("검색어").fill(first.name);
  await page.getByLabel("검색어").press("Enter");
  await expect(page).toHaveURL(/keyword=/);
  await expect(row).toBeVisible();

  // 판매 구분은 고르면 바로 찾는다. 체크는 주소가 바뀐 뒤 따라온다
  const used = page.getByRole("radio", { name: "중고품" });
  await used.click();
  await expect(page).toHaveURL(/salesType=USED/);
  await expect(used).toBeChecked();

  // 초기화하면 조건이 모두 지워진다
  await page.getByRole("button", { name: "초기화" }).first().click();
  await expect(page).toHaveURL(/\/admin\/product$/);
  await expect(page.getByLabel("검색어")).toHaveValue("");

  await row.getByRole("link", { name: "수정" }).click();
  await expect(page).toHaveURL(`/admin/product/${first.id}/edit`);
  await expect(page.getByRole("heading", { name: "제품 수정" })).toBeVisible();
});

test("조건에 맞는 제품이 없으면 초기화를 권한다", async ({ page }) => {
  await page.goto("/admin/product?keyword=없는제품이름zz");
  await expect(page.getByText("조건에 맞는 제품이 없습니다.")).toBeVisible();
});
