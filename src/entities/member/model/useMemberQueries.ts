"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ApiError } from "@/shared/api";
import { loadPortOne, requestIdentityVerification } from "@/shared/lib";
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

export const IDENTITY_CANCELLED = "IDENTITY_CANCELLED";

// 업체 창을 열어 본인인증을 받고 서버에 넘긴다. 창을 닫으면 IDENTITY_CANCELLED 오류로 끝난다
// 업체 창은 누른 순간에 열려야 해서 업체 스크립트를 화면이 뜰 때 미리 받는다
export const useVerifyIdentity = (purpose: MemberDto.VerificationPurpose) => {
  useEffect(() => {
    loadPortOne().catch(() => undefined);
  }, []);

  return useMutation({
    mutationFn: async () => {
      const id = await requestIdentityVerification();
      if (!id)
        throw new ApiError(
          0,
          IDENTITY_CANCELLED,
          "본인확인을 마치지 못했습니다. 다시 시도해 주세요.",
        );
      return MemberApi.verifyIdentity(id, purpose);
    },
  });
};
