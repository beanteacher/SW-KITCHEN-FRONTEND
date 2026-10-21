const numberFormat = new Intl.NumberFormat("ko-KR");

export function formatNumber(value: number) {
  return numberFormat.format(value);
}

// 1800000 → "1,800,000원"
export function formatPrice(value: number) {
  return `${formatNumber(value)}원`;
}

export type DiscountType = "NONE" | "RATE" | "AMOUNT";

// 정률은 "10%", 정액은 "-5,000원", 할인 없음은 빈 문자열
export function formatDiscount(type: DiscountType, value: number | null) {
  if (type === "NONE" || value === null) return "";
  if (type === "RATE") return `${value}%`;
  return `-${formatPrice(value)}`;
}
