import { describe, expect, it } from "vitest";
import { isCustomerPassword } from "./customerPassword";

describe("고객 비밀번호 규칙", () => {
  it("영문·숫자·특수문자를 모두 넣은 8자 이상만 받는다", () => {
    expect(isCustomerPassword("abcd123!")).toBe(true);
    expect(isCustomerPassword("abcd1234")).toBe(false);
    expect(isCustomerPassword("ab1!")).toBe(false);
  });

  it("공백·한글은 특수문자로 치지 않고, 72바이트를 넘으면 받지 않는다", () => {
    expect(isCustomerPassword("abcd 1234")).toBe(false);
    expect(isCustomerPassword("abcd1234가")).toBe(false);
    expect(isCustomerPassword(`a1!${"b".repeat(70)}`)).toBe(false);
  });
});
