"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberKeys, type MemberDto } from "@/entities/member";
import { StaffAdminApi } from "../api/staffAdminApi";

// 성공해도 실패해도 목록을 다시 읽는다. 실패는 대개 그 사이 다른 관리자가 바꿨기 때문이다
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: StaffAdminApi.create,
    onSettled: () => queryClient.invalidateQueries({ queryKey: memberKeys.staff() }),
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: number;
      role?: MemberDto.StaffRole;
      status?: MemberDto.AccountStatus;
    }) => StaffAdminApi.update(id, data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: memberKeys.staff() }),
  });
};

export const useResetStaffPassword = () => {
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      StaffAdminApi.resetPassword(id, password),
  });
};
