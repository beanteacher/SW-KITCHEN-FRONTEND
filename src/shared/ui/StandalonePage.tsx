import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

// 화면 아래·안의 큰 버튼 (높이 44, 둥글기 4). solid 검정, line 흰 바탕
export function standaloneButtonClass(variant: "solid" | "line" = "solid") {
  return cn(
    "flex h-11 w-full items-center justify-center rounded-[4px] border text-sm font-medium disabled:cursor-default disabled:border-[#e8e8e8] disabled:bg-[#e8e8e8] disabled:text-[#aaa]",
    variant === "solid"
      ? "border-black bg-black text-white"
      : "border-[#e0e0e0] bg-white text-black",
  );
}

interface Props {
  title: string;
  // [‹] 을 누르면 갈 곳. 없으면 [‹] 를 두지 않는다
  backHref?: string;
  onBack?: () => void;
  // 화면 아래에 붙는 버튼 줄
  footer?: ReactNode;
  children: ReactNode;
}

// 쇼핑몰 머리글 없이 따로 뜨는 화면 (로그인·가입·찾기). 회색 바탕 가운데 600px 흰 칸 (무신사와 같은 틀)
export default function StandalonePage({ title, backHref, onBack, footer, children }: Props) {
  const backIcon = <ChevronLeft className="size-5" strokeWidth={1.6} aria-hidden />;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto flex min-h-screen w-full max-w-[600px] flex-col bg-white">
        <header className="flex h-[52px] shrink-0 items-center gap-2 bg-[#f5f5f5] px-4">
          {onBack ? (
            <button type="button" onClick={onBack} aria-label="이전" className="-ml-1">
              {backIcon}
            </button>
          ) : (
            backHref && (
              <Link href={backHref} aria-label="이전" className="-ml-1">
                {backIcon}
              </Link>
            )
          )}
          <h1 className="text-base font-medium">{title}</h1>
        </header>
        <main className="flex-1 px-4 pt-8 pb-16">{children}</main>
        {footer && (
          <div className="sticky bottom-0 border-t border-[#f1f1f1] bg-white px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
