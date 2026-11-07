export * as MemberDto from "./memberDto";

export type SocialProvider = "KAKAO" | "NAVER";

export type StaffRole = "STAFF" | "ADMIN";

export type AccountStatus = "ACTIVE" | "SUSPENDED";

// 백오피스 회원 목록 한 줄. 소셜로만 가입했으면 userId 가 없다
export interface AdminSummary {
  id: number;
  userId?: string | null;
  name?: string;
  linkedProviders?: SocialProvider[];
  createdAt?: string;
}

export interface AdminSearchParams {
  keyword?: string;
  page: number;
  size?: number;
}

export interface Staff {
  id: number;
  userId?: string;
  name?: string;
  role?: StaffRole;
  status?: AccountStatus;
  createdAt?: string;
}
