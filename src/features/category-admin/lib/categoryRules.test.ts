import { describe, expect, it } from "vitest";
import type { CategoryDto } from "@/entities/category";
import { ApiError } from "@/shared/api";
import {
  getCodePrefix,
  getDeleteBlockReason,
  getDuplicateAbbrMessage,
  getServerFieldErrors,
  moveCategory,
  normalizeAbbr,
} from "./categoryRules";

function category(
  id: number,
  abbr: string,
  productCount = 0,
  children: CategoryDto.AdminTree[] = [],
) {
  return { id, name: `분류${id}`, abbr, sortOrder: id, productCount, children };
}

describe("약어 칸", () => {
  it("대문자로 바꾸고 영문 외 글자는 지우며 2자까지만 남긴다", () => {
    expect(normalizeAbbr("rf")).toBe("RF");
    expect(normalizeAbbr("r1-f")).toBe("RF");
    expect(normalizeAbbr("냉장")).toBe("");
    expect(normalizeAbbr("abc")).toBe("AB");
  });
});

describe("약어 겹침", () => {
  const siblings = [category(1, "RF"), category(2, "WS")];

  it("형제 중 같은 약어가 있으면 그 분류 이름으로 문구를 준다", () => {
    expect(getDuplicateAbbrMessage(siblings, "WS")).toBe('"분류2"과 겹침');
    expect(getDuplicateAbbrMessage(siblings, "CK")).toBeNull();
  });

  it("고치는 중인 자기 자신과는 겹친다고 보지 않는다", () => {
    expect(getDuplicateAbbrMessage(siblings, "RF", 1)).toBeNull();
  });
});

describe("서버 거부를 칸 오류로", () => {
  it("약어 겹침·잠김은 약어 칸에, 항목별 오류는 그 칸에 붙인다", () => {
    expect(getServerFieldErrors(new ApiError(409, "CATEGORY_ABBR_DUPLICATE", "겹침"))).toEqual({
      abbr: "방금 다른 분류가 이 약어로 추가되었습니다",
    });
    expect(
      getServerFieldErrors(new ApiError(409, "CATEGORY_ABBR_LOCKED", "약어를 바꿀 수 없습니다.")),
    ).toEqual({ abbr: "약어를 바꿀 수 없습니다." });
    const invalid = new ApiError(400, "VALIDATION_ERROR", "입력값 오류", [
      { field: "name", message: "분류 이름은 20자 이하입니다." },
    ]);
    expect(getServerFieldErrors(invalid)).toEqual({ name: "분류 이름은 20자 이하입니다." });
  });

  it("칸에 붙일 수 없는 오류는 null 이다", () => {
    expect(getServerFieldErrors(new ApiError(500, "INTERNAL_ERROR", "서버 오류"))).toBeNull();
    expect(getServerFieldErrors(new Error("다른 오류"))).toBeNull();
  });
});

describe("상품 코드 앞자리", () => {
  it("대분류 약어 뒤에 중분류 약어를 붙인다", () => {
    expect(getCodePrefix(category(1, "RF"), category(12, "UR"))).toBe("RFUR");
  });
});

describe("삭제 막기", () => {
  it("중분류가 있는 대분류는 중분류 수를 알려 준다", () => {
    const big = category(1, "RF", 9, [category(12, "UR", 9), category(13, "TB")]);

    expect(getDeleteBlockReason(big)).toBe(
      '"분류1" 아래에 중분류가 2개 있어 삭제할 수 없습니다. 중분류를 먼저 삭제해 주세요.',
    );
  });

  it("제품이 있는 중분류는 제품 수를 알려 준다", () => {
    expect(getDeleteBlockReason(category(13, "TB", 9))).toBe(
      '"분류13"에 제품 9개가 연결되어 있어 삭제할 수 없습니다. 제품의 분류를 먼저 바꿔 주세요.',
    );
  });

  it("중분류도 제품도 없으면 지울 수 있다", () => {
    expect(getDeleteBlockReason(category(13, "TB"))).toBeNull();
  });
});

describe("순서 바꾸기", () => {
  const siblings = [category(1, "RF"), category(2, "WS"), category(3, "CK")];

  it("위·아래 분류와 자리를 바꾼 형제 전체 순서를 돌려준다", () => {
    expect(moveCategory(siblings, 2, -1)).toEqual([2, 1, 3]);
    expect(moveCategory(siblings, 2, 1)).toEqual([1, 3, 2]);
  });

  it("맨 위에서 위로, 맨 아래에서 아래로는 못 간다", () => {
    expect(moveCategory(siblings, 1, -1)).toBeNull();
    expect(moveCategory(siblings, 3, 1)).toBeNull();
  });
});
