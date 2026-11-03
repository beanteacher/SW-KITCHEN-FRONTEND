import { describe, expect, it } from "vitest";
import { getSalesTypeLockReason, getSalesTypeNotice } from "./salesTypeRules";

describe("판매 구분 바꾸기", () => {
  it("등록 화면은 셋 다 고를 수 있다", () => {
    expect(getSalesTypeLockReason(null, "USED", false)).toBeNull();
  });

  it("신제품 → 재고품은 되고, 예약이 없는 재고품만 신제품으로 바꿀 수 있다", () => {
    expect(getSalesTypeLockReason("NEW", "STOCK", false)).toBeNull();
    expect(getSalesTypeLockReason("STOCK", "NEW", false)).toBeNull();
    expect(getSalesTypeLockReason("STOCK", "NEW", true)).toBe(
      "예약이 있어 신제품으로 바꿀 수 없습니다",
    );
  });

  it("중고품으로·중고품에서는 바꿀 수 없다", () => {
    expect(getSalesTypeLockReason("NEW", "USED", false)).toBe(
      "새 제품을 중고품으로 바꿀 수 없습니다",
    );
    expect(getSalesTypeLockReason("STOCK", "USED", false)).toBe(
      "새 제품을 중고품으로 바꿀 수 없습니다",
    );
    expect(getSalesTypeLockReason("USED", "NEW", false)).toBe(
      "중고품은 다른 판매 구분으로 바꿀 수 없습니다",
    );
    expect(getSalesTypeLockReason("USED", "STOCK", false)).toBe(
      "중고품은 다른 판매 구분으로 바꿀 수 없습니다",
    );
  });

  it("신제품 ↔ 재고품으로 바꾸면 안내를 띄우고, 그대로면 띄우지 않는다", () => {
    expect(getSalesTypeNotice("NEW", "STOCK")).toContain("재고품으로 바꾸면");
    expect(getSalesTypeNotice("STOCK", "NEW")).toContain("신제품으로 바꾸면");
    expect(getSalesTypeNotice("STOCK", "STOCK")).toBeNull();
    expect(getSalesTypeNotice(null, "STOCK")).toBeNull();
  });
});
