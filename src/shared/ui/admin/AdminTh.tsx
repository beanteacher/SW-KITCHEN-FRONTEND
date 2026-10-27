import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

// 관리자 표의 머리 칸. 높이 34, 회색 바탕, 12px 굵게
export default function AdminTh({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-[34px] border-r border-b border-r-admin-head-line border-b-admin-line bg-admin-fill px-2 text-xs leading-[18px] font-semibold whitespace-nowrap text-admin-text last:border-r-0",
        className,
      )}
      {...props}
    />
  );
}
