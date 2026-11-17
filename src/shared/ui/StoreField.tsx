"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/shared/lib";
import PasswordToggle from "./PasswordToggle";

// 고객 화면 입력칸 (무신사형: 높이 36, 회색 테두리, 둥글기 4). 오류는 빨간 테두리, 통과는 검정 테두리
const BOX_CLASS = "flex h-9 min-w-0 flex-1 rounded-[4px] border";
const INPUT_CLASS =
  "h-full min-w-0 flex-1 rounded-[4px] bg-transparent px-2 text-sm outline-none placeholder:text-placeholder";

type Tone = "default" | "error" | "ok";

function boxTone(tone: Tone) {
  if (tone === "error") return "border-store-danger";
  if (tone === "ok") return "border-black";
  return "border-[#e0e0e0] focus-within:border-black";
}

interface InputProps extends ComponentProps<"input"> {
  tone?: Tone;
}

export function StoreInput({ tone = "default", className, ...props }: InputProps) {
  return (
    <div className={cn(BOX_CLASS, boxTone(tone), className)}>
      <input className={INPUT_CLASS} aria-invalid={tone === "error"} {...props} />
    </div>
  );
}

export function StorePasswordInput({
  tone = "default",
  className,
  ...props
}: Omit<InputProps, "type">) {
  const [shown, setShown] = useState(false);
  return (
    <div className={cn(BOX_CLASS, boxTone(tone), className)}>
      <input
        type={shown ? "text" : "password"}
        className={INPUT_CLASS}
        aria-invalid={tone === "error"}
        {...props}
      />
      <PasswordToggle shown={shown} onToggle={() => setShown((value) => !value)} />
    </div>
  );
}

// 본인확인으로 받은 값처럼 고칠 수 없는 칸. 회색 바탕 + 오른쪽 작은 안내
export function StoreReadonlyInput({
  value,
  note,
  ...props
}: { value: string; note: string } & ComponentProps<"input">) {
  return (
    <div className={cn(BOX_CLASS, "border-[#f0f0f0] bg-[#f5f5f5]")}>
      <input readOnly value={value} className={cn(INPUT_CLASS, "text-[#555]")} {...props} />
      <span className="mr-2 self-center text-[11px] whitespace-nowrap text-placeholder">
        {note}
      </span>
    </div>
  );
}

// 칸 아래 11px 한 줄. error 빨강, ok 초록, hint 회색
export function StoreFieldMessage({
  tone = "error",
  children,
}: {
  tone?: "error" | "ok" | "hint";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "mx-0.5 mt-1.5 text-[11px] leading-[14px]",
        tone === "error" && "text-store-danger",
        tone === "ok" && "text-success",
        tone === "hint" && "text-placeholder",
      )}
    >
      {children}
    </p>
  );
}

// 이름 + 칸 한 덩어리. 칸 사이 18px
export function StoreField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-[18px]">
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
