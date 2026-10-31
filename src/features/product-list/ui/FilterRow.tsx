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
        indent && "min-h-8 pl-7",
        selected && "font-bold",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center border-2 border-[#cbd1d7]",
          shape === "radio" && "rounded-full",
          selected && shape === "checkbox" && "border-[#333] bg-[#333] text-white",
          selected &&
            shape === "radio" &&
            "border-[#333] shadow-[inset_0_0_0_3px_#fff,inset_0_0_0_10px_#333]",
        )}
      >
        {selected && shape === "checkbox" && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      {label}
      <span className="text-xs font-normal text-[#ccc]">{count ?? 0}</span>
    </Link>
  );
}
