import { describe, expect, it } from "vitest";
import { parseProductListQuery, toggle, toProductListHref, withCategory } from "./productListQuery";

describe("쇼핑몰 목록의 주소 조건", () => {
  it("주소의 조건을 읽고, 같은 조건을 다시 주소로 만든다", () => {
    const href =
      "/product/stock?categoryId=12&salesType=USED&materials=STAINLESS&materials=PLASTIC&orderBy=PRICE_ASC&page=2";
    const query = parseProductListQuery(new URL(href, "http://x").searchParams);

    expect(query).toEqual({
      keyword: "",
      categoryId: 12,
      salesTypes: ["USED"],
      materials: ["STAINLESS", "PLASTIC"],
      orderBy: "PRICE_ASC",
      page: 2,
    });
    expect(toProductListHref("/product/stock", query)).toBe(href);
  });

  it("이상한 값은 조건이 없는 것으로 보고, 기본값은 주소에서 뺀다", () => {
    const query = parseProductListQuery(
      new URLSearchParams("categoryId=-3&materials=WOOD&orderBy=toString&page=abc"),
    );

    expect(query).toEqual({
      keyword: "",
      categoryId: null,
      salesTypes: [],
      materials: [],
      orderBy: "POPULAR",
      page: 1,
    });
    expect(toProductListHref("/product/new", query)).toBe("/product/new");
  });

  it("분류를 바꾸면 고른 재질·판매 구분을 지우고 1페이지로 가며, 정렬은 둔다", () => {
    const query = parseProductListQuery(
      new URLSearchParams(
        "categoryId=12&salesType=USED&materials=STAINLESS&orderBy=PRICE_ASC&page=3",
      ),
    );

    expect(withCategory(query, 13)).toEqual({
      ...query,
      categoryId: 13,
      salesTypes: [],
      materials: [],
      page: 1,
    });
  });

  it("네모 상자는 누를 때마다 넣었다 뺀다", () => {
    expect(toggle(["STAINLESS"], "PLASTIC")).toEqual(["STAINLESS", "PLASTIC"]);
    expect(toggle(["STAINLESS", "PLASTIC"], "STAINLESS")).toEqual(["PLASTIC"]);
  });
});
