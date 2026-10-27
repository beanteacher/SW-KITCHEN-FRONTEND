import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

// 관리자 표의 틀. 위는 검정 굵은 선, 나머지는 회색 선. 칸은 AdminTh·AdminTd 로 채운다
export default function AdminTable({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("border border-t-2 border-admin-line border-t-ink bg-white", className)}
      {...props}
    />
  );
}
