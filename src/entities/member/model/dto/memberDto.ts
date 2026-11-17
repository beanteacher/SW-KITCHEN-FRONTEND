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

// 본인확인 목적. 가입은 만 14세를 보고, 찾기·번호 변경은 보지 않는다
export type VerificationPurpose = "SIGNUP" | "FIND" | "PHONE_CHANGE";

// 같은 사람의 계정이 이미 있을 때. 소셜로만 가입했으면 maskedUserId 가 없다
export interface ExistingAccount {
  maskedUserId?: string | null;
  linkedProviders?: SocialProvider[];
  createdAt?: string;
}

// 방금 본인확인한 본인에게만 보여주는 값
export interface VerifiedIdentity {
  name: string;
  birthDate: string;
  phone: string;
  existingAccount?: ExistingAccount | null;
}
