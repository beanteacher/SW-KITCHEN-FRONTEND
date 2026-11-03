import { describe, expect, it } from "vitest";
import { parseProductListFilters, toProductListQuery } from "./productListFilters";

describe("제품 관리 목록의 주소 조건", () => {
  it("주소의 조건을 읽고, 같은 조건을 다시 주소로 만든다", () => {
    const query = "keyword=%EB%83%89%EC%9E%A5%EA%B3%A0&categoryId=3&salesType=USED&page=2";
    const filters = parseProductListFilters(new URLSearchParams(query));

    expect(filters).toEqual({ keyword: "냉장고", categoryId: 3, salesType: "USED", page: 2 });
    expect(toProductListQuery(filters)).toBe(query);
  });

  it("이상한 값은 조건이 없는 것으로 보고, 빈 조건과 1페이지는 주소에서 뺀다", () => {
    const filters = parseProductListFilters(
      new URLSearchParams("categoryId=abc&salesType=toString&page=-1"),
    );

    expect(filters).toEqual({ keyword: "", categoryId: null, salesType: null, page: 1 });
    expect(toProductListQuery(filters)).toBe("");
  });
});
