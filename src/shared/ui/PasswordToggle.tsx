"use client";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib";

interface Props {
  shown: boolean;
  onToggle: () => void;
  // store 는 고객 화면 칸(36px), admin 은 관리자 칸(32px) 오른쪽에 붙는다
  variant?: "store" | "admin";
}

// 비밀번호 칸 오른쪽 [보기] 눈. 아이콘은 지금 상태를 보여준다: 가려져 있으면 감은 눈, 보이면 뜬 눈 (무신사와 같음)
export default function PasswordToggle({ shown, onToggle, variant = "store" }: Props) {
  const Icon = shown ? Eye : EyeOff;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? "비밀번호 숨기기" : "비밀번호 보기"}
      className={cn(
        "grid shrink-0 place-items-center text-placeholder",
        variant === "store" ? "w-9" : "w-8",
      )}
    >
      <Icon className={variant === "store" ? "size-5" : "size-4"} strokeWidth={1.6} aria-hidden />
    </button>
  );
}
