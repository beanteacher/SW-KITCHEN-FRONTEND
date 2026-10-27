import { describe, expect, it } from "vitest";
import { calcSalePrice } from "./calcSalePrice";

// 서버 판매가 테스트와 같은 예시를 둔다 (화면 미리보기와 저장값이 같아야 한다)
describe("판매가 계산", () => {
  it("정률 17% 는 12,450원에서 100원 미만을 버려 12,400원", () => {
    expect(calcSalePrice(15_000, "RATE", 17)).toBe(12_400);
  });

  it("정액 할인은 정상가에서 빼고, 할인이 없으면 정상가 그대로", () => {
    expect(calcSalePrice(15_000, "AMOUNT", 3_000)).toBe(12_000);
    expect(calcSalePrice(15_050, "NONE", null)).toBe(15_050);
  });

  it("정상가가 커도 정률 계산이 틀리지 않는다", () => {
    expect(calcSalePrice(2_000_000_000, "RATE", 1)).toBe(1_980_000_000);
  });

  it("계산할 수 없으면 null — 정상가 없음, 정률 0·100, 정액이 정상가 이상, 할인 값 없음", () => {
    expect(calcSalePrice(null, "NONE", null)).toBeNull();
    expect(calcSalePrice(15_000, "RATE", 0)).toBeNull();
    expect(calcSalePrice(15_000, "RATE", 100)).toBeNull();
    expect(calcSalePrice(15_000, "AMOUNT", 15_000)).toBeNull();
    expect(calcSalePrice(15_000, "AMOUNT", null)).toBeNull();
  });
});
