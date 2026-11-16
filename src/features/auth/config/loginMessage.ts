// 로그인 실패 코드 → 비밀번호 칸 아래 한 줄
export const LOGIN_ERROR_MESSAGE: Record<string, string> = {
  LOGIN_FAILED: "아이디 또는 비밀번호가 맞지 않습니다.",
  CAPTCHA_REQUIRED: "보안문자를 확인해 주세요.",
  LOGIN_RATE_LIMITED: "로그인 시도가 너무 많습니다. 10분 뒤 다시 시도해 주세요.",
  ACCOUNT_SUSPENDED: "사용이 정지된 계정입니다. 관리자에게 문의해 주세요.",
};

export const SOCIAL_LOGIN_ERROR = "카카오·네이버 로그인을 하지 못했습니다. 다시 시도해 주세요.";

export const LOGIN_FALLBACK_MESSAGE = "로그인하지 못했습니다. 잠시 뒤 다시 시도해 주세요.";
