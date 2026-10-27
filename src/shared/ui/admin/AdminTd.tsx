import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

// 관리자 표의 칸. 기본은 가운데 정렬, 여백 6px 8px. 화면마다 다른 높이·여백·정렬은 className 으로 바꾼다
export default function AdminTd({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "border-r border-b border-r-admin-cell-vline border-b-admin-cell-line px-2 py-1.5 text-center align-middle last:border-r-0",
        className,
      )}
      {...props}
    />
  );
}
