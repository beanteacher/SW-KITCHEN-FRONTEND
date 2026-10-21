// 서버에서만 읽는 값. 기본값은 로컬 개발용이다.
export const env = {
  apiServerUrl: process.env.API_SERVER_URL ?? "http://localhost:8080",
};
