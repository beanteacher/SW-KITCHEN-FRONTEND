import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

// 관리자 입력칸 공통 모양. 오류가 있으면 aria-invalid 를 주면 빨간 테두리가 된다
export const ADMIN_FIELD_CLASS =
  "w-full rounded-[2px] border border-admin-border bg-white text-[13px] text-ink placeholder:text-gray-400 focus:border-admin-text focus:outline-none disabled:bg-admin-fill disabled:text-[#999] aria-invalid:border-admin-error";

// sm 은 화면 입력칸(높이 32), xs 는 표 안 입력칸(높이 28)
const SIZE = {
  sm: "h-8 px-2.5",
  xs: "h-7 px-2",
};

interface Props extends Omit<ComponentProps<"input">, "size"> {
  size?: keyof typeof SIZE;
}

// 관리자 화면 입력칸. 사용자 화면에는 쓰지 않는다
export default function AdminInput({ size = "sm", className, ...props }: Props) {
  return <input className={cn(ADMIN_FIELD_CLASS, SIZE[size], className)} {...props} />;
}
