import type { MemberDto } from "../model/dto/memberDto";

export const SOCIAL_PROVIDER_LABEL: Record<MemberDto.SocialProvider, string> = {
  KAKAO: "카카오",
  NAVER: "네이버",
};

export const SOCIAL_PROVIDERS = Object.keys(SOCIAL_PROVIDER_LABEL) as MemberDto.SocialProvider[];
