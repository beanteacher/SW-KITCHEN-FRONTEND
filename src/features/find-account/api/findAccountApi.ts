import { apiRequest } from "@/shared/api";
import type { MemberDto } from "@/entities/member";

export * as FindAccountApi from "./findAccountApi";

export interface FoundAccount {
  userId?: string | null;
  linkedProviders?: MemberDto.SocialProvider[];
  createdAt?: string;
}

// 찾기용 본인확인을 한 사람의 계정. 아이디를 가리지 않는다. 없으면 404 ACCOUNT_NOT_FOUND
export const findId = () => apiRequest<FoundAccount>("member/find-id");

// 로그인은 시키지 않는다. 그 계정의 모든 기기가 로그아웃된다
export const resetPassword = (userId: string, newPassword: string) =>
  apiRequest<void>("member/password-reset", { method: "patch", json: { userId, newPassword } });
