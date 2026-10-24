import { describe, expect, it } from "vitest";
import { getAfterLoginPath } from "./redirect";

describe("로그인 뒤 갈 곳", () => {
  it("이 사이트 안 주소면 그대로 간다", () => {
    expect(getAfterLoginPath("/admin/category?page=2", "STAFF")).toBe("/admin/category?page=2");
  });

  it("주소가 없으면 담당자·관리자는 관리 화면, 고객은 쇼핑몰로 간다", () => {
    expect(getAfterLoginPath(null, "STAFF")).toBe("/admin/product");
    expect(getAfterLoginPath(null, "ADMIN")).toBe("/admin/product");
    expect(getAfterLoginPath("", "CUSTOMER")).toBe("/product/new");
  });

  it("바깥 사이트 주소는 무시한다", () => {
    expect(getAfterLoginPath("https://evil.example", "STAFF")).toBe("/admin/product");
    expect(getAfterLoginPath("//evil.example", "STAFF")).toBe("/admin/product");
    expect(getAfterLoginPath("/\\evil.example", "STAFF")).toBe("/admin/product");
    expect(getAfterLoginPath("javascript:alert(1)", "CUSTOMER")).toBe("/product/new");
  });
});
