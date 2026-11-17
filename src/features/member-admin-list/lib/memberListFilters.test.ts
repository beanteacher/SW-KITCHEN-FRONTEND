import { describe, expect, it } from "vitest";
import { parseMemberListFilters, toMemberListQuery } from "./memberListFilters";

describe("회원 목록의 주소 조건", () => {
  it("주소의 검색어·페이지를 읽고 같은 주소로 다시 만든다", () => {
    const query = "keyword=%EA%B9%80%EC%A3%BC%EB%B0%A9&page=3";
    const filters = parseMemberListFilters(new URLSearchParams(query));

    expect(filters).toEqual({ keyword: "김주방", page: 3 });
    expect(toMemberListQuery(filters)).toBe(query);
  });

  it("이상한 페이지는 1로 보고, 빈 검색어와 1페이지는 주소에서 뺀다", () => {
    const filters = parseMemberListFilters(new URLSearchParams("keyword=%20%20&page=abc"));

    expect(filters).toEqual({ keyword: "", page: 1 });
    expect(toMemberListQuery(filters)).toBe("");
  });
});
