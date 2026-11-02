import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib";

interface Props {
  href: string;
  label: string;
  count?: number;
  selected: boolean;
  // 분류는 동그라미(하나만), 판매 구분·재질은 네모(여러 개)
  shape: "radio" | "checkbox";
  // 중분류 줄: 대분류 아래 세로선 + 한 단계 작고 흐린 글자·동그라미
  indent?: boolean;
}

// 필터 한 줄: 상자 + 이름 + 그 줄을 골랐을 때의 제품 수. 고르면 굵게 + 상자 채움 (색은 입히지 않는다)
export default function FilterRow({ href, label, count, selected, shape, indent = false }: Props) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex min-h-9 items-center gap-2 text-sm text-[#333]",
        indent &&
          "ml-[9px] min-h-[30px] border-l border-[#e5e5e5] pl-[18px] text-[13px] text-[#666]",
        selected && "font-bold",
        indent && selected && "text-[#333]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center border-2 border-[#cbd1d7]",
          shape === "radio" && "rounded-full",
          indent && "size-4",
          selected && shape === "checkbox" && "border-[#333] bg-[#333] text-white",
          selected &&
            shape === "radio" &&
            (indent
              ? "border-[#333] shadow-[inset_0_0_0_2px_#fff,inset_0_0_0_8px_#333]"
              : "border-[#333] shadow-[inset_0_0_0_3px_#fff,inset_0_0_0_10px_#333]"),
        )}
      >
        {selected && shape === "checkbox" && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      {label}
      <span className="text-xs font-normal text-[#ccc]">{count ?? 0}</span>
    </Link>
  );
}
