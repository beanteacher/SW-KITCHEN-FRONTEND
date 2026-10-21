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

export function getMe() {
  return apiRequest<Me>("auth/me");
}

export function logout() {
  return apiRequest<void>("auth/logout", { method: "post" });
}
