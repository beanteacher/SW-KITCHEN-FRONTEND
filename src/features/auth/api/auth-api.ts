import { apiRequest } from "@/shared/api";

export type Role = "CUSTOMER" | "STAFF" | "ADMIN";

export interface Me {
  id: number;
  userId: string;
  role: Role;
}

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResult extends Me {
  // 처음 받은 비밀번호 그대로 로그인했으면 true. 바꾸라는 안내만 하고 막지는 않는다
  passwordChangeRecommended: boolean;
}

export function login(request: LoginRequest) {
  return apiRequest<LoginResult>("auth/login", { method: "post", json: request });
}

export function getMe() {
  return apiRequest<Me>("auth/me");
}

export function logout() {
  return apiRequest<void>("auth/logout", { method: "post" });
}
