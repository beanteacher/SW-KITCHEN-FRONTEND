// 기본값은 로컬 개발용이다.
export const env = {
  // 서버에서만 읽는다
  apiServerUrl: process.env.API_SERVER_URL ?? "http://localhost:8080",
  // 브라우저도 읽는다 (NEXT_PUBLIC_ 은 빌드할 때 박힌다). 로그인 보안문자 사이트 키
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA",
};
