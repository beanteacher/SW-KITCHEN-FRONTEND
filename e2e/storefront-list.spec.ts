import { expect, test } from "./fixtures";

test("재고·중고품 목록에서 거르고 정렬하면 주소에 남고, 초기화하면 지워진다", async ({ page }) => {
  await page.goto("/product/stock");
  const filter = page.getByRole("complementary");
  const list = page.getByRole("region", { name: "제품 목록" });

  const used = filter.getByRole("link", { name: /^중고품/ });
  await used.click();
  await expect(page).toHaveURL(/salesType=USED/);
  await expect(used).toHaveAttribute("aria-current", "true");

  const priceAsc = list.getByRole("link", { name: "낮은 가격순" });
  await priceAsc.click();
  await expect(page).toHaveURL(/orderBy=PRICE_ASC/);
  await expect(priceAsc).toHaveAttribute("aria-current", "true");

  // 초기화는 필터만 지우고 정렬은 둔다
  await filter.getByRole("link", { name: "초기화" }).click();
  await expect(page).toHaveURL(/\/product\/stock\?orderBy=PRICE_ASC$/);
});

test("카드는 제품 상세로 가는 링크다", async ({ page }) => {
  await page.goto("/product/stock");
  const cards = page.getByRole("region", { name: "제품 목록" }).getByRole("listitem");
  test.skip((await cards.count()) === 0, "팔 수 있는 재고품·중고품이 있어야 한다");

  await expect(cards.first().getByRole("link")).toHaveAttribute("href", /^\/product\/\d+$/);
});

test("없는 페이지 번호로 오면 마지막 페이지를 보여준다", async ({ page }) => {
  // 화면을 두 번 열면 첫 화면의 요청이 끊겨 콘솔 오류가 남아서, 신제품이 있는지는 API 로 본다
  const response = await page.request.get("/api/v1/product?salesType=NEW&size=1");
  const { data } = (await response.json()) as { data: { totalElements: number } };
  test.skip(data.totalElements === 0, "신제품이 있어야 한다");

  await page.goto("/product/new?page=999");
  await expect(
    page.getByRole("region", { name: "제품 목록" }).getByRole("listitem").first(),
  ).toBeVisible();
});

test("검색 결과가 없으면 검색어를 넣어 알려 준다", async ({ page }) => {
  await page.goto("/search?keyword=없는제품이름zz");

  await expect(page.getByText("‘없는제품이름zz’에 맞는 제품이 없습니다")).toBeVisible();
});
