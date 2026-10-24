import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

// 분류 표의 칸. 칸마다 선이 있는 촘촘한 관리자 표 모양이고 기본은 가운데 정렬이다
export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-[34px] border-r border-b border-[#d5d9de] bg-[#f4f5f7] px-2 text-xs font-semibold whitespace-nowrap last:border-r-0",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "h-10 border-r border-b border-[#eceef0] px-2 py-1 text-center align-middle last:border-r-0",
        className,
      )}
      {...props}
    />
  );
}
