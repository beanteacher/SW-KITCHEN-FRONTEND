"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MemberApi } from "../api/memberApi";
import type { MemberDto } from "./dto/memberDto";

// 쿼리 키 팩토리. 직원 계정을 바꾼 뒤에는 staff 로 다시 읽는다
export const memberKeys = {
  all: ["member"] as const,
  adminList: (params: MemberDto.AdminSearchParams) =>
    [...memberKeys.all, "admin-list", params] as const,
  staff: () => [...memberKeys.all, "staff"] as const,
};

// 조건을 바꿔 다시 읽는 동안 이전 목록을 그대로 둔다
export const useAdminMembers = (params: MemberDto.AdminSearchParams) => {
  return useQuery({
    queryKey: memberKeys.adminList(params),
    queryFn: () => MemberApi.adminList(params),
    placeholderData: keepPreviousData,
  });
};

export const useStaffList = () => {
  return useQuery({ queryKey: memberKeys.staff(), queryFn: MemberApi.staffList });
};
