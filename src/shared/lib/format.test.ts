import { describe, expect, it } from "vitest";
import { formatDate, formatPrice } from "./format";

describe("가격 표시", () => {
  it("세 자리마다 쉼표를 찍고 원을 붙인다", () => {
    expect(formatPrice(1800000)).toBe("1,800,000원");
    expect(formatPrice(0)).toBe("0원");
  });
});

describe("날짜 표시", () => {
  it("한국 시각 기준 날짜만 남긴다", () => {
    expect(formatDate("2026-11-20T14:22:00+09:00")).toBe("2026-11-20");
    // UTC 로는 전날이지만 한국 시각으로는 다음 날이다
    expect(formatDate("2026-11-20T16:00:00Z")).toBe("2026-11-21");
  });
});
