import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import ErrorIllustration from "./ErrorIllustration";

interface Props {
  kind: "not-found" | "error";
  title: string;
  children: ReactNode;
  actions: ReactNode;
  // 버튼 아래에 더 보여 줄 것 (404 의 새로 들어온 제품)
  extra?: ReactNode;
}

// 고객 오류 화면 본문: 흰 바탕 + 주방 그림 + 제목 + 두 줄 + 버튼
export default function ErrorScreen({ kind, title, children, actions, extra }: Props) {
  return (
    <section className="px-4 pt-16 pb-[72px] text-center">
      <ErrorIllustration kind={kind} />
      <h1 className="mt-5 mb-2.5 text-2xl font-bold tracking-[-0.3px]">{title}</h1>
      <p className="mb-7 text-[15px] leading-6 text-[#6b6259]">{children}</p>
      <div className="flex flex-wrap justify-center gap-2">{actions}</div>
      {extra}
    </section>
  );
}

// 오류 화면 버튼 (높이 44, 둥글기 4). solid 검정, line 투명 바탕
export function errorButtonClass(variant: "solid" | "line" = "solid") {
  return cn(
    "inline-flex h-11 items-center justify-center rounded-[4px] border px-[22px] text-sm font-medium",
    variant === "solid" ? "border-ink bg-ink text-white" : "border-[#e0e0e0] bg-white text-ink",
  );
}
