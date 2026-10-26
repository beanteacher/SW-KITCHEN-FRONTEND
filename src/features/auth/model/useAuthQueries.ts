"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthApi } from "../api/authApi";

// 쿼리 키 팩토리
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useMe = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: AuthApi.me,
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: AuthApi.logout,
    // 실패해도 화면 쪽 정보는 지우고 쇼핑몰로 보낸다. / 는 다시 넘겨주기만 하므로 첫 화면으로 바로 간다
    onSettled: () => {
      queryClient.clear();
      router.replace("/product/new");
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.login,
    // 로그인 응답에 내 정보가 들어 있으니 다시 묻지 않고 그대로 넣어 둔다
    onSuccess: ({ id, userId, role }) => {
      queryClient.clear();
      queryClient.setQueryData(authKeys.me(), { id, userId, role });
    },
  });
};
