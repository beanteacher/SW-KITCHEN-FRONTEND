"use client";

import { useMutation } from "@tanstack/react-query";
import { MemberApi } from "@/entities/member";
import { FindAccountApi } from "../api/findAccountApi";

export const useCheckUserId = () => useMutation({ mutationFn: MemberApi.checkUserId });
export const useFindId = () => useMutation({ mutationFn: FindAccountApi.findId });
export const useResetPassword = () =>
  useMutation({
    mutationFn: ({ userId, newPassword }: { userId: string; newPassword: string }) =>
      FindAccountApi.resetPassword(userId, newPassword),
  });
