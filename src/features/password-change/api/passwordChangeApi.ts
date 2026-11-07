import { apiRequest } from "@/shared/api";

export * as PasswordChangeApi from "./passwordChangeApi";

// 바꾸면 이 기기만 남고 다른 기기는 로그아웃된다
export const change = (data: { currentPassword: string; newPassword: string }) =>
  apiRequest<void>("auth/password", { method: "patch", json: data });
