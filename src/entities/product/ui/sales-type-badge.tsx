import { cn } from "@/shared/lib";
import { SALES_TYPE_LABEL, type SalesType } from "../model/sales-type";

// 쇼핑몰: 연한 바탕 + 진한 글자, 둥글기 4
const STORE_CLASS: Record<SalesType, string> = {
  NEW: "bg-[#DDF7B0] text-[#2E6B00]",
  STOCK: "bg-[#E8F0FE] text-[#1A56C4]",
  USED: "bg-[#EEF0F2] text-[#4B5563]",
};

// 관리자: 흰 바탕 + 글자색 테두리의 각진 도장 모양. 신제품만 연두 바탕에 라임 테두리
const ADMIN_CLASS: Record<SalesType, string> = {
  NEW: "border-[#6CBF00] bg-[#DDF7B0] text-[#2E6B00]",
  STOCK: "border-[#1A56C4] bg-white text-[#1A56C4]",
  USED: "border-[#4B5563] bg-white text-[#4B5563]",
};

interface SalesTypeBadgeProps {
  salesType: SalesType;
  variant?: "store" | "admin";
}

export function SalesTypeBadge({ salesType, variant = "store" }: SalesTypeBadgeProps) {
  const variantClass =
    variant === "store"
      ? cn("rounded-[4px]", STORE_CLASS[salesType])
      : cn("border-[1.5px] tracking-[0.5px]", ADMIN_CLASS[salesType]);

  return (
    <span className={cn("inline-flex h-5 items-center px-1.5 text-xs font-bold", variantClass)}>
      {SALES_TYPE_LABEL[salesType]}
    </span>
  );
}
