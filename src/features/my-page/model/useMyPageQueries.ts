"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MyPageApi } from "../api/myPageApi";

export const myPageKeys = {
  all: ["my-page"] as const,
  me: () => [...myPageKeys.all, "me"] as const,
};

export const useMyInfo = () =>
  useQuery({ queryKey: myPageKeys.me(), queryFn: MyPageApi.me, retry: false });

const useInvalidateMe = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: myPageKeys.me() });
};

export const useChangeMarketing = () => {
  const invalidate = useInvalidateMe();
  return useMutation({ mutationFn: MyPageApi.changeMarketing, onSettled: invalidate });
};

export const useChangePhone = () => {
  const invalidate = useInvalidateMe();
  return useMutation({ mutationFn: MyPageApi.changePhone, onSettled: invalidate });
};

export const useWithdraw = () => useMutation({ mutationFn: MyPageApi.withdraw });
