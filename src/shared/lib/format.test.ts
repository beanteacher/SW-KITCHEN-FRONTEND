import { describe, expect, it } from "vitest";
import { formatDiscount, formatPrice } from "./format";

describe("가격 표시", () => {
  it("세 자리마다 쉼표를 찍고 원을 붙인다", () => {
    expect(formatPrice(1800000)).toBe("1,800,000원");
    expect(formatPrice(0)).toBe("0원");
  });

  it("정률 할인은 퍼센트로, 정액 할인은 빼기 금액으로 보여준다", () => {
    expect(formatDiscount("RATE", 10)).toBe("10%");
    expect(formatDiscount("AMOUNT", 5000)).toBe("-5,000원");
  });

  it("할인이 없거나 값이 비어 있으면 아무것도 보여주지 않는다", () => {
    expect(formatDiscount("NONE", 10)).toBe("");
    expect(formatDiscount("RATE", null)).toBe("");
  });
});
