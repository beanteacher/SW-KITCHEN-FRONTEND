import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

// 분류 표의 칸. 기본은 가운데 정렬
export default function Td({ className, ...props }: ComponentProps<"td">) {
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
