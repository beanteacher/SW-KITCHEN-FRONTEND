import Link from "next/link";
import { cn } from "@/shared/lib";

const TABS = [
  { key: "id", href: "/find/id", label: "아이디 찾기" },
  { key: "password", href: "/find/password", label: "비밀번호 재설정" },
] as const;

// 무신사 실측: 탭 높이 50, 지금 탭 흰 바탕, 다른 탭 #f1f1f1 바탕 #aaa 글자
export default function FindTabs({ current }: { current: "id" | "password" }) {
  return (
    <nav aria-label="찾기" className="-mt-2 mb-7 grid grid-cols-2">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === current ? "page" : undefined}
          className={cn(
            "flex h-[50px] items-center justify-center text-sm",
            tab.key === current
              ? "border border-b-0 border-[#f1f1f1] bg-white font-medium text-black"
              : "bg-[#f1f1f1] text-[#aaa]",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
