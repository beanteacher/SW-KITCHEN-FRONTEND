import type { APIRequestContext } from "@playwright/test";
import { expect, test } from "./fixtures";

interface Option {
  productCode: string;
  salePrice: number;
  visibleQty: number | null;
}

interface Detail {
  id: number;
  name: string;
  options: Option[];
}

// 살 수 있는 옵션이 둘 이상인 제품을 찾는다
async function findProductWithTwoOptions(request: APIRequestContext) {
  const response = await request.get("/api/v1/product?size=36");
  const { data } = (await response.json()) as { data: { content: { id: number }[] } };
  for (const { id } of data.content) {
    const detail = await request.get(`/api/v1/product/${id}`);
    const product = ((await detail.json()) as { data: Detail }).data;
    if (product.options.filter((option) => option.visibleQty !== 0).length >= 2) return product;
  }
  return null;
}

test("로그인하지 않아도 상세가 열리고, 옵션을 바꾸면 상품 코드·가격·수량이 그 옵션으로 바뀐다", async ({
  page,
}) => {
  const product = await findProductWithTwoOptions(page.request);
  test.skip(product === null, "살 수 있는 옵션이 둘 이상인 제품이 있어야 한다");
  const second = product!.options.filter((option) => option.visibleQty !== 0)[1];

  await page.goto(`/product/${product!.id}`);
  await expect(page.getByRole("heading", { level: 1, name: product!.name })).toBeVisible();

  const qty = page.getByLabel("수량", { exact: true });
  await page.getByRole("button", { name: "더하기" }).click();
  await expect(qty).toHaveText("2");

  // 옵션을 바꾸면 수량은 1 로 돌아간다
  await page.getByRole("combobox", { name: "사이즈" }).click();
  // 드롭다운 줄은 옵션 순서 그대로다
  await page.getByRole("option").nth(product!.options.indexOf(second)).click();
  await expect(page.getByRole("table").getByText(second.productCode)).toBeVisible();
  await expect(qty).toHaveText("1");
  await expect(page.getByText("총 상품금액")).toContainText(
    `${second.salePrice.toLocaleString("ko-KR")}원`,
  );
});

test("탭을 누르면 그 구역으로 가고 지금 탭이 바뀐다", async ({ page }) => {
  const response = await page.request.get("/api/v1/product?size=1");
  const { data } = (await response.json()) as { data: { content: { id: number }[] } };
  test.skip(data.content.length === 0, "제품이 있어야 한다");

  await page.goto(`/product/${data.content[0].id}`);
  const tabs = page.getByRole("navigation", { name: "상세 구역" });
  await expect(tabs.getByRole("link", { name: "상세정보" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  const descTab = tabs.getByRole("link", { name: "상품설명" });
  test.skip((await descTab.count()) === 0, "상세 이미지나 설명이 있는 제품이어야 한다");

  await descTab.click();
  await expect(descTab).toHaveAttribute("aria-current", "true");
  await expect(page.getByRole("heading", { name: "상품설명" })).toBeInViewport();
});

test.describe("없는 제품", () => {
  // 개발 서버에서만 React 가 그리기 시간을 재다(performance.measure) 남기는 오류다. 배포 빌드에서는 나지 않는다
  // Chrome 은 "negative time stamp", WebKit 은 그냥 "Type error" 로 남긴다
  // 배열에 둘 이상 넣으면 [값, 설정] 으로 읽히므로 정규식 하나로 합친다
  test.use({ expectedConsoleErrors: [/cannot have a negative time stamp|^Type error$/] });

  test("없는 제품이면 검색 엔진이 담지 않게 하고, 안내와 신제품 링크를 보여준다", async ({
    page,
  }) => {
    await page.goto("/product/999999999");

    await expect(page.getByText("찾는 제품이 없습니다")).toBeVisible();
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", "noindex");
    await page.getByRole("link", { name: "신제품 보기" }).click();
    await expect(page).toHaveURL("/product/new");
  });
});
