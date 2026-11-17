import { apiRequest } from "@/shared/api";
import type { MemberDto } from "@/entities/member";

export * as MyPageApi from "./myPageApi";

const BASE_URL = "member/me";

// 소셜로만 가입했으면 userId 가 없고 hasPassword 가 false
export interface Me {
  userId?: string | null;
  name?: string;
  birthDate?: string;
  phone?: string;
  linkedProviders?: MemberDto.SocialProvider[];
  marketingAgreed?: boolean;
  hasPassword?: boolean;
  createdAt?: string;
}

export const me = () => apiRequest<Me>(BASE_URL);

export const changeMarketing = (agreed: boolean) =>
  apiRequest<void>(`${BASE_URL}/marketing`, { method: "patch", json: { agreed } });

// 휴대폰 번호 변경용 본인확인을 마친 뒤 부른다. 다른 사람의 본인확인이면 409 IDENTITY_MISMATCH
export const changePhone = () => apiRequest<void>(`${BASE_URL}/phone`, { method: "patch" });

// 아이디 가입 계정은 비밀번호, 소셜로만 가입한 계정은 소셜 로그인을 다시 한 뒤에 받는다
export const withdraw = (password?: string) =>
  apiRequest<void>(`${BASE_URL}/withdraw`, { method: "post", json: { password } });
