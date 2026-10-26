import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

const VARIANT = {
  primary: "bg-ink text-white hover:bg-ink/90",
  outline: "border border-line bg-white text-ink hover:bg-gray-50",
  danger: "bg-danger text-white hover:bg-danger/90",
};

// xs 는 관리자 표 안(높이 24), sm 은 관리자 화면(높이 32, 모서리 2), lg 는 쇼핑몰 큰 버튼
const SIZE = {
  xs: "h-6 rounded-[2px] px-2 text-xs",
  sm: "h-8 rounded-[2px] px-3 text-[13px]",
  md: "h-9 rounded-md px-4 text-sm",
  lg: "h-14 rounded-xl px-6 text-base font-bold",
};

interface Props extends ComponentProps<"button"> {
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
}

export default function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1 whitespace-nowrap outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    />
  );
}
