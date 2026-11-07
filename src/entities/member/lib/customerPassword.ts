// 고객 비밀번호 규칙: 8자 이상 72바이트 이하, 영문·숫자·특수문자(영문·숫자·공백 밖의 ASCII) 각 1자 이상
// 가입·비밀번호 재설정·마이페이지 변경 화면이 칸 아래에 같은 순서로 보여준다
export const CUSTOMER_PASSWORD_RULES = [
  { label: "8자 이상", test: (value: string) => value.length >= 8 },
  { label: "영문", test: (value: string) => /[A-Za-z]/.test(value) },
  { label: "숫자", test: (value: string) => /[0-9]/.test(value) },
  { label: "특수문자", test: (value: string) => /[!-/:-@[-`{-~]/.test(value) },
] as const;

const MAX_BYTES = 72;

export const CUSTOMER_PASSWORD_MESSAGE =
  "비밀번호는 영문·숫자·특수문자를 모두 넣어 8자 이상으로 정해 주세요.";

export function isCustomerPassword(value: string) {
  return (
    CUSTOMER_PASSWORD_RULES.every((rule) => rule.test(value)) &&
    new TextEncoder().encode(value).length <= MAX_BYTES
  );
}
