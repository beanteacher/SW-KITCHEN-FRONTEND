import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

// 쇼핑몰 화면 버튼 모양. 링크를 버튼 모양으로 보여 줄 때도 같은 모양을 쓴다
export function buttonClass() {
  return "inline-flex h-9 items-center justify-center rounded-md border border-line bg-white px-4 text-sm hover:bg-gray-50";
}

// 쇼핑몰 화면 버튼. 관리자 화면에는 AdminButton 을 쓴다
export default function Button({ type = "button", className, ...props }: ComponentProps<"button">) {
  return <button type={type} className={cn(buttonClass(), className)} {...props} />;
}
