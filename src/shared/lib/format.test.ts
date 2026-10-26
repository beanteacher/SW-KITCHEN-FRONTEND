import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

describe("가격 표시", () => {
  it("세 자리마다 쉼표를 찍고 원을 붙인다", () => {
    expect(formatPrice(1800000)).toBe("1,800,000원");
    expect(formatPrice(0)).toBe("0원");
  });
});
