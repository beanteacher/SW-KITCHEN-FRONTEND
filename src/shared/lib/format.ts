const numberFormat = new Intl.NumberFormat("ko-KR");

export function formatNumber(value: number) {
  return numberFormat.format(value);
}

// 1800000 → "1,800,000원"
export function formatPrice(value: number) {
  return `${formatNumber(value)}원`;
}

// 서버의 ISO 시각 "2026-11-20T14:22:00+09:00" → "2026-11-20". 한국 시각 기준 날짜다. 관리 화면 날짜
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date(value));
}

// 고객 화면 날짜 "2026.11.20". 고객 화면은 줄표 대신 점을 쓰고, 일시는 날짜 아래에 회색 시각을 둔다
export function formatStoreDate(value: string) {
  return formatDate(value).replaceAll("-", ".");
}

// "01012345678" → "010-1234-5678". 모양이 다르면 그대로 둔다
export function formatPhone(value: string) {
  return value.replace(/^(01\d)(\d{3,4})(\d{4})$/, "$1-$2-$3");
}
