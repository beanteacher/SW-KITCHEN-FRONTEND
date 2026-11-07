import { apiRequest, type PageResponse } from "@/shared/api";
import type { MemberDto } from "../model/dto/memberDto";

export * as MemberApi from "./memberApi";

// 백오피스 회원 목록. 가입 최신순. 빈 검색어는 보내지 않는다
export const adminList = ({ keyword, page, size }: MemberDto.AdminSearchParams) =>
  apiRequest<PageResponse<MemberDto.AdminSummary>>("admin/member", {
    searchParams: { ...(keyword ? { keyword } : {}), page, ...(size ? { size } : {}) },
  });

// 직원 계정 전부 (페이지 없음)
export const staffList = () => apiRequest<MemberDto.Staff[]>("admin/staff");
