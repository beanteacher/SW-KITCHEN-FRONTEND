// 기본값은 로컬 개발용이다.
export const env = {
  // 서버에서만 읽는다
  apiServerUrl: process.env.API_SERVER_URL ?? "http://localhost:8080",
  // 브라우저도 읽는다 (NEXT_PUBLIC_ 은 빌드할 때 박힌다). 로그인 보안문자 사이트 키
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA",
  // 포트원 본인인증. 비어 있으면 업체 창이 열리지 않고 "본인확인을 마치지 못했습니다" 로 끝난다
  portoneStoreId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID ?? "",
  portoneChannelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY ?? "",
};
