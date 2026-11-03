import { expect, login, test } from "./fixtures";
import {
  CATEGORY,
  NAME_PREFIX,
  removeSeedProducts,
  type SeededProducts,
  seedProducts,
} from "./seedProducts";

// 품절·할인·옵션 수가 정해진 시험용 제품으로 화면 표시를 확인한다. 고객 화면은 로그인하지 않고 본다
let seeded: SeededProducts;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await login(page);
  seeded = await seedProducts(page.request);
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await browser.newPage();
  await login(page);
  await removeSeedProducts(page.request);
  await page.close();
});

test.describe("제품 상세", () => {
  test("옵션 일부가 품절인 재고품: 살 수 있는 옵션이 처음 골라지고, 품절 옵션은 고를 수 없다", async ({
    page,
  }) => {
    await page.goto(`/product/${seeded.stockPartlySoldOut}`);

    const size = page.getByRole("combobox", { name: "사이즈" });
    await expect(size).toHaveText("1,500×600×800 mm");
    // 할인 표시: 할인율 + 정상가 취소선 + 판매가
    await expect(page.getByText("10%", { exact: true })).toBeVisible();
    await expect(page.locator("s").filter({ hasText: "100,000원" })).toBeVisible();
    await expect(page.getByText("90,000원").first()).toBeVisible();
    await expect(page.getByRole("definition").filter({ hasText: /^3개$/ })).toBeVisible();

    await size.click();
    const soldOut = page.getByRole("option").filter({ hasText: "1,200×600×800 mm" });
    await expect(soldOut).toContainText("품절");
    await expect(soldOut).toHaveAttribute("aria-disabled", "true");

    await expect(page.getByText("부가세 별도")).toHaveCount(0);
    await expect(page.getByText("재입고")).toHaveCount(0);
  });

  test("상품 상세정보는 고정 6줄 다음에 사양 줄이고, 상품설명은 상세 이미지 다음에 설명 글이다", async ({
    page,
  }) => {
    await page.goto(`/product/${seeded.stockPartlySoldOut}`);

    const info = page.getByRole("region", { name: "상품 상세정보" });
    await expect(info.getByRole("rowheader")).toHaveText([
      "제품명",
      "제조사",
      "상품 코드",
      "원산지",
      "사이즈",
      "재질",
      "소비전력",
      "전원",
    ]);
    await expect(info.getByRole("row").filter({ hasText: "사이즈" })).toContainText(
      "1,500×600×800 mm",
    );

    const description = page.getByRole("region", { name: "상품설명" });
    // 상세 이미지는 꾸밈 이미지(alt="")라 역할로 찾지 않는다
    await expect(description.locator("img")).toHaveCount(2);
    await expect(description.getByText("둘째 줄입니다.")).toBeVisible();
  });

  test("모든 옵션이 품절인 중고품: 판매된 제품 안내와 누를 수 없는 품절 버튼, 상품설명 탭 없음", async ({
    page,
  }) => {
    await page.goto(`/product/${seeded.usedSoldOut}`);

    await expect(page.getByText("판매된 제품입니다.")).toBeVisible();
    await expect(page.getByRole("button", { name: "품절" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "장바구니 담기" })).toHaveCount(0);
    // 상세 이미지와 설명이 모두 없다
    const tabs = page.getByRole("navigation", { name: "상세 구역" });
    await expect(tabs.getByRole("link")).toHaveText(["상세정보"]);
  });

  test("옵션 하나인 신제품: 그 옵션이 골라진 드롭다운이 보이고, 남은 수량 줄이 없다", async ({
    page,
  }) => {
    await page.goto(`/product/${seeded.newSingle}`);

    await expect(page.getByRole("combobox", { name: "사이즈" })).toHaveText("1,800×600×800 mm");
    await expect(page.getByText("남은 수량")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "장바구니 담기" })).toBeEnabled();
  });

  test("정액 할인 옵션을 고르면 빼는 금액과 정상가 취소선이 보인다", async ({ page }) => {
    await page.goto(`/product/${seeded.newVaries}`);

    await page.getByRole("combobox", { name: "사이즈" }).click();
    await page.getByRole("option").filter({ hasText: "1,200×600×800 mm" }).click();
    await expect(page.getByText("-5,000원", { exact: true })).toBeVisible();
    await expect(page.locator("s").filter({ hasText: "139,000원" })).toBeVisible();
  });
});

test("목록 카드: 제조사·판매 구분·대표 가격을 보이고, 옵션 가격이 다르면 ~ 를 붙인다. 품절·수량은 없다", async ({
  page,
}) => {
  await page.goto(`/search?keyword=${encodeURIComponent(NAME_PREFIX)}`);
  const list = page.getByRole("region", { name: "제품 목록" });
  const card = (name: string) => list.getByRole("listitem").filter({ hasText: name });

  await expect(card("신제품 가격 다름")).toContainText("129,000원~");
  await expect(card("신제품 옵션 하나")).toContainText("200,000원");
  await expect(card("신제품 옵션 하나")).not.toContainText("~");
  await expect(card("재고품 일부 품절")).toContainText("시험제조");
  await expect(card("재고품 일부 품절")).toContainText("재고품");
  // 모두 품절인 중고품은 목록에 없다
  await expect(card("중고품 모두 품절")).toHaveCount(0);
  // 품절 표시가 없다 (시험용 제품 이름에 든 "품절" 글자는 빼고 본다)
  await expect(list.getByText("품절", { exact: true })).toHaveCount(0);
});

test.describe("관리 화면", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "/login?redirect=/admin/product");
  });

  test("제품 관리 목록: 신제품 행은 재고 칸이 — 이고, 재고품 행은 수량을 보인다", async ({
    page,
  }) => {
    await page.goto(`/admin/product?keyword=${encodeURIComponent(NAME_PREFIX)}`);
    const row = (name: string) => page.getByRole("row").filter({ hasText: name });

    // 모델명 칸 하나 + 재고·잡아 둔·보이는 수량 세 칸
    await expect(row("신제품 옵션 하나").getByText("—", { exact: true })).toHaveCount(4);
    // 재고품 첫 옵션(재고 0)은 모델명 칸만 — 다
    await expect(row("재고품 일부 품절").getByText("—", { exact: true })).toHaveCount(1);
  });

  test("제품명을 누르면 수정 화면으로 간다", async ({ page }) => {
    await page.goto(`/admin/product?keyword=${encodeURIComponent(NAME_PREFIX)}`);

    await page.getByRole("link", { name: `${NAME_PREFIX} 신제품 옵션 하나` }).click();
    await expect(page).toHaveURL(`/admin/product/${seeded.newSingle}/edit`);
  });

  test("고른 제품을 묻고 지우면 목록에서 빠지고, 고르지 않으면 선택 삭제를 누를 수 없다", async ({
    page,
  }) => {
    await page.goto(`/admin/product?keyword=${encodeURIComponent(`${NAME_PREFIX} 지울`)}`);
    const remove = page.getByRole("button", { name: /^선택 삭제/ });
    await expect(remove).toBeDisabled();

    await page.getByRole("checkbox", { name: "이 페이지 제품 모두 고르기" }).check();
    await expect(remove).toHaveText("선택 삭제 (2)");
    await remove.click();

    const ask = page.getByRole("dialog", { name: "제품 삭제" });
    await expect(ask).toContainText("제품 2개를 삭제할까요?");
    await expect(ask).toContainText(`${NAME_PREFIX} 지울 제품 1`);
    await ask.getByRole("button", { name: "삭제" }).click();

    const done = page.getByRole("dialog", { name: "삭제 완료" });
    await expect(done).toContainText("제품 2개를 삭제했습니다.");
    await done.getByRole("button", { name: "확인" }).click();
    await expect(page.getByText("조건에 맞는 제품이 없습니다.")).toBeVisible();
    const response = await page.request.get(`/api/v1/product/${seeded.toDelete[0]}`);
    expect(response.status()).toBe(404);
  });

  test("제품 등록: 모든 옵션에 같은 값으로 정상가를 넣으면 모든 옵션 줄에 들어간다", async ({
    page,
  }) => {
    await page.goto("/admin/product/new");
    const listPrices = page.getByRole("textbox", { name: /^\d+번 정상가$/ });
    while ((await listPrices.count()) < 3) {
      await page.getByRole("button", { name: "+ 옵션 추가" }).click();
    }

    const bulk = page
      .locator("div")
      .filter({ hasText: /^모든 옵션에 같은 값/ })
      .last();
    await bulk.getByRole("textbox").nth(3).fill("150000");
    await bulk.getByRole("button", { name: "적용" }).click();

    for (const input of await listPrices.all()) await expect(input).toHaveValue("150,000");
  });
});

test.describe("분류 관리 옆 패널", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "/login?redirect=/admin/category");
  });

  test("수량을 누르면 옆 패널에 그 분류의 제품이 열리고, 닫으면 주소는 그대로다", async ({
    page,
  }) => {
    await page.getByRole("button", { name: CATEGORY.big, exact: true }).click();
    await expect(page).toHaveURL(/\?big=\d+$/);
    const url = page.url();
    const count = page
      .getByRole("region", { name: "중분류" })
      .getByRole("button", { name: new RegExp(`^${CATEGORY.mid} 제품 \\d+개 보기$`) });
    await count.click();

    const panel = page.getByRole("dialog", { name: `제품 — ${CATEGORY.mid}` });
    await expect(panel).toBeVisible();
    await expect(
      panel.getByRole("row").filter({ hasText: `${NAME_PREFIX} 신제품 옵션 하나` }),
    ).toBeVisible();
    // 목록 확인 + 선택 삭제만: [수정]·제품명 링크가 없다
    await expect(panel.getByRole("link")).toHaveCount(0);
    await expect(panel.getByRole("button", { name: "수정" })).toHaveCount(0);

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(count).toBeFocused();
    expect(page.url()).toBe(url);
  });

  test("삭제 불가 창의 [제품 보기]로 패널에서 제품을 모두 지우면 분류를 지울 수 있다", async ({
    page,
  }) => {
    await page.getByRole("button", { name: CATEGORY.big, exact: true }).click();
    const midRow = page
      .getByRole("region", { name: "중분류" })
      .getByRole("row")
      .filter({ hasText: CATEGORY.mid });
    await midRow.getByRole("button", { name: "삭제" }).click();

    const blocked = page.getByRole("dialog", { name: "삭제 불가" });
    await expect(blocked).toContainText("[제품 보기]에서 제품을 삭제하거나");
    await blocked.getByRole("button", { name: "제품 보기" }).click();

    const panel = page.getByRole("dialog", { name: `제품 — ${CATEGORY.mid}` });
    await panel.getByRole("checkbox", { name: "이 페이지 제품 모두 고르기" }).check();
    await panel.getByRole("button", { name: /^선택 삭제/ }).click();
    await page
      .getByRole("dialog", { name: "제품 삭제" })
      .getByRole("button", { name: "삭제" })
      .click();
    await page
      .getByRole("dialog", { name: "삭제 완료" })
      .getByRole("button", { name: "확인" })
      .click();
    await expect(panel.getByText("이 분류에 연결된 제품이 없습니다.")).toBeVisible();
    await panel.getByRole("button", { name: "닫기" }).click();

    // 수량이 0 이 되어 숫자 버튼이 사라지고, 이제 지울 수 있다
    await expect(midRow.getByRole("button", { name: /제품 \d+개 보기/ })).toHaveCount(0);
    await midRow.getByRole("button", { name: "삭제" }).click();
    await page
      .getByRole("dialog", { name: "분류 삭제" })
      .getByRole("button", { name: "삭제" })
      .click();
    await expect(page.getByRole("dialog", { name: "삭제 완료" })).toBeVisible();
  });
});
