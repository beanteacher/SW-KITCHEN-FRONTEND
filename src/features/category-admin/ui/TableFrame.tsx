import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

// 분류 표의 틀. 위는 검정 굵은 선, 나머지는 회색 선
export default function TableFrame({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("border border-t-2 border-admin-line border-t-ink bg-white", className)}
      {...props}
    />
  );
}
