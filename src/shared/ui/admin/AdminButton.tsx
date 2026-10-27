import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

const VARIANT = {
  primary: "border border-ink bg-ink text-white hover:bg-ink/90",
  outline: "border border-admin-border bg-white text-admin-text hover:bg-gray-50",
  danger: "border border-danger bg-danger text-white hover:bg-danger/90",
};

// sm 은 화면 버튼(높이 32), xs 는 표 안 버튼(높이 24). 모서리 2
const SIZE = {
  sm: "h-8 px-3.5 text-[13px] disabled:opacity-45",
  // 표 안 잠긴 버튼은 흐리게 하지 않고 글자·테두리만 옅게 한다 (▲▼ 끝 등)
  xs: "h-6 px-2 text-xs leading-[18px] disabled:border-admin-head-line disabled:bg-white disabled:text-admin-border",
};

interface ButtonStyle {
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
}

// 링크를 버튼 모양으로 보여 줄 때도 같은 모양을 쓴다
export function adminButtonClass({ variant = "primary", size = "sm" }: ButtonStyle = {}) {
  return cn(
    "inline-flex items-center justify-center gap-1 rounded-[2px] whitespace-nowrap outline-offset-2 disabled:cursor-not-allowed",
    VARIANT[variant],
    SIZE[size],
    // 화면 버튼의 기본(primary)만 굵게, 표 안 버튼은 보통 굵기
    variant === "primary" && size === "sm" && "font-semibold",
  );
}

interface Props extends ComponentProps<"button">, ButtonStyle {}

// 관리자 화면 버튼. 사용자 화면에는 쓰지 않는다
export default function AdminButton({
  variant,
  size,
  type = "button",
  className,
  ...props
}: Props) {
  return (
    <button type={type} className={cn(adminButtonClass({ variant, size }), className)} {...props} />
  );
}
