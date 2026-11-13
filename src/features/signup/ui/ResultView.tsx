import type { ReactNode } from "react";

// 가운데 정렬 안내 화면 (완료·이미 가입·만 14세 미만·시간 지남). 버튼은 아래로 쌓는다
export default function ResultView({
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
