import { describe, expect, it } from "vitest";
import { formatDiscount } from "./formatDiscount";

describe("할인 표시", () => {
  it("정률 할인은 퍼센트로, 정액 할인은 빼기 금액으로 보여준다", () => {
    expect(formatDiscount("RATE", 10)).toBe("10%");
    expect(formatDiscount("AMOUNT", 5000)).toBe("-5,000원");
  });

  it("할인이 없거나 값이 비어 있으면 아무것도 보여주지 않는다", () => {
    expect(formatDiscount("NONE", 10)).toBe("");
    expect(formatDiscount("RATE", null)).toBe("");
  });
});
