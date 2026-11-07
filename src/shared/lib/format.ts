const numberFormat = new Intl.NumberFormat("ko-KR");

export function formatNumber(value: number) {
  return numberFormat.format(value);
}

// 1800000 → "1,800,000원"
export function formatPrice(value: number) {
  return `${formatNumber(value)}원`;
}

// 서버의 ISO 시각 "2026-11-20T14:22:00+09:00" → "2026-11-20". 한국 시각 기준 날짜다
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date(value));
}
