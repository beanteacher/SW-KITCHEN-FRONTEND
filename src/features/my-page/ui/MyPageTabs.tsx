import { cn } from "@/shared/lib";

// 지금은 내 정보만 연다. 주문·견적·설계 요청은 그 기능을 만들 때 연다 (흐리게 자리만)
const TABS = [
  { label: "내 정보", ready: true },
  { label: "주문 내역", ready: false },
  { label: "견적 내역", ready: false },
  { label: "설계 요청", ready: false },
];

// 가로 탭. 칸이 모자라면 줄을 바꾸지 않고 탭 줄만 가로로 넘긴다
export default function MyPageTabs() {
  return (
    <nav
      aria-label="마이페이지"
      className="mb-7 flex gap-6 overflow-x-auto border-b border-[#e0e0e0] [scrollbar-width:none]"
    >
      {TABS.map((tab, index) => (
        <span
          key={tab.label}
          aria-current={index === 0 ? "page" : undefined}
          aria-disabled={!tab.ready || undefined}
          className={cn(
            "shrink-0 py-3 text-[15px] whitespace-nowrap",
            index === 0 ? "font-bold text-black shadow-[inset_0_-2px_0_#000]" : "text-[#ccc]",
          )}
        >
          {tab.label}
        </span>
      ))}
    </nav>
  );
}
