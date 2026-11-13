import type { ReactNode } from "react";

// 따로 뜨는 화면의 가운데 정렬 안내 (가입 완료·계정 없음·비밀번호 바꿈 등). 버튼은 아래로 쌓는다
export default function StandaloneResult({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="pt-10 text-center">
      <h2 className="mb-2.5 text-lg leading-[26px] font-semibold">{title}</h2>
      <div className="mb-7 text-sm leading-[22px] text-[#666]">{children}</div>
      <div className="flex flex-col gap-3 text-left">{actions}</div>
    </div>
  );
}
