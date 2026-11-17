import { cn } from "@/shared/lib";
import type { MemberDto } from "../model/dto/memberDto";

// 카카오 노랑·네이버 초록 (각 회사 디자인 규칙의 색과 로고)
const PROVIDERS = {
  kakao: {
    name: "카카오",
    label: "카카오로 시작하기",
    className: "border-[#fee500] bg-[#fee500] text-black",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#000"
          d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7l-1 3.7c-.1.3.3.6.6.4l4.4-2.9c.4 0 .9.1 1.3.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"
        />
      </svg>
    ),
  },
  naver: {
    name: "네이버",
    label: "네이버로 시작하기",
    className: "border-[#03c75a] bg-[#03c75a] text-white",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
        <path fill="#fff" d="M16.3 12.8 7.4 0H0v24h7.7V11.2L16.6 24H24V0h-7.7z" />
      </svg>
    ),
  },
};

export type SocialProviderPath = keyof typeof PROVIDERS;

// 서버 값(KAKAO) → 주소 값(kakao)
export function socialProviderPath(provider: MemberDto.SocialProvider): SocialProviderPath {
  return provider === "KAKAO" ? "kakao" : "naver";
}

export const SOCIAL_BUTTON_CLASS =
  "flex h-10 items-center justify-center gap-1.5 rounded-[4px] border border-[#e0e0e0] text-sm font-medium";

// 카카오·네이버 로그인 주소. 서버가 그 회사 로그인 화면으로 보내므로 화면 안 이동이 아니라 주소 이동이다
export function socialLoginHref(
  provider: SocialProviderPath,
  returnUrl?: string,
  purpose?: "reauth",
) {
  const params = new URLSearchParams();
  if (returnUrl) params.set("returnUrl", returnUrl);
  if (purpose) params.set("purpose", purpose);
  const query = params.toString();
  return `/api/v1/auth/oauth/${provider}${query ? `?${query}` : ""}`;
}

interface Props {
  providers?: SocialProviderPath[];
  returnUrl?: string;
  // 버튼 글자. 기본은 "카카오로 시작하기", 찾기 화면은 "카카오로 로그인"
  verb?: string;
}

export default function SocialLoginButtons({
  providers = ["kakao", "naver"],
  returnUrl,
  verb,
}: Props) {
  return (
    <>
      {providers.map((provider) => (
        <a
          key={provider}
          href={socialLoginHref(provider, returnUrl)}
          className={cn(SOCIAL_BUTTON_CLASS, PROVIDERS[provider].className)}
        >
          {PROVIDERS[provider].icon}
          {verb ? `${PROVIDERS[provider].name}로 ${verb}` : PROVIDERS[provider].label}
        </a>
      ))}
    </>
  );
}
