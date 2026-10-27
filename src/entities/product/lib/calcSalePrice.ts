import type { ProductDto } from "../model/dto/productDto";

// 판매가. 서버가 저장할 때 쓰는 식과 같다 — 정률은 100원 미만을 버리고, 정액은 정상가에서 뺀다
// 계산할 수 없으면(정상가 없음, 정률 1~99 밖, 정액이 정상가 이상 등) null
export function calcSalePrice(
  listPrice: number | null,
  discountType: ProductDto.DiscountType,
  discountValue: number | null,
) {
  if (listPrice === null || listPrice < 1) return null;
  if (discountType === "NONE") return listPrice;
  if (discountValue === null || discountValue < 1) return null;
  if (discountType === "RATE") {
    if (discountValue > 99) return null;
    return Math.floor((listPrice * (100 - discountValue)) / 10_000) * 100;
  }
  if (discountValue >= listPrice) return null;
  return listPrice - discountValue;
}
