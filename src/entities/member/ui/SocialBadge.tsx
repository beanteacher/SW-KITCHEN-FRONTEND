import { cn } from "@/shared/lib";
import { SOCIAL_PROVIDER_LABEL } from "../config/socialProviderLabel";
import type { MemberDto } from "../model/dto/memberDto";

// 카카오 노랑·네이버 초록 (각 회사 디자인 규칙의 색)
const PROVIDER_CLASS: Record<MemberDto.SocialProvider, string> = {
  KAKAO: "bg-[#fee500] text-[#191919]",
  NAVER: "bg-[#03c75a] text-white",
};

interface Props {
  provider: MemberDto.SocialProvider;
  // admin 은 표 안 작은 표시(높이 18), store 는 고객 화면(높이 22)
  variant?: "store" | "admin";
  // "카카오로 가입"처럼 뒤에 붙는 글자
  suffix?: string;
}

export default function SocialBadge({ provider, variant = "store", suffix = "" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] font-semibold whitespace-nowrap",
        variant === "admin" ? "h-[18px] px-1.5 text-[11px]" : "h-[22px] px-2 text-xs",
        PROVIDER_CLASS[provider],
      )}
    >
      {SOCIAL_PROVIDER_LABEL[provider]}
      {suffix}
    </span>
  );
}
