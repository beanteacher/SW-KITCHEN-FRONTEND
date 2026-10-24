import { apiRequest } from "@/shared/api";
import type { LoginRequest, LoginResult, Me } from "../model/types";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function login(request: LoginRequest) {
  return apiRequest<LoginResult>("auth/login", { method: "post", json: request });
}

export function getMe() {
  return apiRequest<Me>("auth/me");
}

export function logout() {
  return apiRequest<void>("auth/logout", { method: "post" });
}
