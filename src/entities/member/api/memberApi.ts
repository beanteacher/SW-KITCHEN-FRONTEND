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

// 업체 창에서 받은 인증 건 번호를 서버에 넘긴다. 서버가 업체에 결과를 직접 묻고 본인확인 쿠키를 준다
export const verifyIdentity = (
  identityVerificationId: string,
  purpose: MemberDto.VerificationPurpose,
) =>
  apiRequest<MemberDto.VerifiedIdentity>("identity-verification", {
    method: "post",
    json: { identityVerificationId, purpose },
  });
