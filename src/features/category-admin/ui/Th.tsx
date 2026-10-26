import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

// 분류 표의 머리 칸. 칸마다 선이 있는 촘촘한 관리자 표 모양
export default function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-[34px] border-r border-b border-admin-line bg-[#f4f5f7] px-2 text-xs font-semibold whitespace-nowrap last:border-r-0",
        className,
      )}
      {...props}
    />
  );
}
