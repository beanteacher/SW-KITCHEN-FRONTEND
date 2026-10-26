const numberFormat = new Intl.NumberFormat("ko-KR");

export function formatNumber(value: number) {
  return numberFormat.format(value);
}

// 1800000 → "1,800,000원"
export function formatPrice(value: number) {
  return `${formatNumber(value)}원`;
}
