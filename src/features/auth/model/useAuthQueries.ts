"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: AuthApi.logout,
    // 실패해도 쇼핑몰로 보낸다. / 는 다시 넘겨주기만 하므로 첫 화면으로 바로 간다
    // 페이지를 새로 불러온다. 화면 안에서 옮기면 Next 가 숨겨 둔 관리 화면이 내 정보를 다시 묻다가 401 을 받아
    // 로그인 화면으로 보내 버리고, 숨긴 화면의 입력값도 메모리에 남는다
    onSettled: () => window.location.replace("/product/new"),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.login,
    // 로그인 응답에 내 정보가 들어 있으니 다시 묻지 않고 그대로 넣어 둔다
    onSuccess: ({ id, userId, name, role }) => {
      queryClient.clear();
      queryClient.setQueryData(authKeys.me(), { id, userId, name, role });
    },
  });
};
