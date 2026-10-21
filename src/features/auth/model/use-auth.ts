"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authKeys, getMe, logout, type Role } from "../api/auth-api";

export const ROLE_LABEL: Record<Role, string> = {
  CUSTOMER: "고객",
  STAFF: "담당자",
  ADMIN: "관리자",
};

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    // 실패해도 화면 쪽 정보는 지우고 쇼핑몰로 보낸다
    onSettled: () => {
      queryClient.clear();
      router.replace("/");
    },
  });
}
