"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authKeys, getMe, login, logout } from "../api/auth-api";
import type { Role } from "./types";

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
    // 실패해도 화면 쪽 정보는 지우고 쇼핑몰로 보낸다. / 는 다시 넘겨주기만 하므로 첫 화면으로 바로 간다
    onSettled: () => {
      queryClient.clear();
      router.replace("/product/new");
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    // 로그인 응답에 내 정보가 들어 있으니 다시 묻지 않고 그대로 넣어 둔다
    onSuccess: ({ id, userId, role }) => {
      queryClient.clear();
      queryClient.setQueryData(authKeys.me(), { id, userId, role });
    },
  });
}
