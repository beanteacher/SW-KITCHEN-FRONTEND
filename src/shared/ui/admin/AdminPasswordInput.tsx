"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/shared/lib";
import PasswordToggle from "../PasswordToggle";

type Props = Omit<ComponentProps<"input">, "type" | "size">;

// 관리자 화면 비밀번호 칸 (높이 32) + 눈 아이콘
export default function AdminPasswordInput({ className, ...props }: Props) {
  const [shown, setShown] = useState(false);

  return (
    <div
      className={cn(
        "flex h-8 w-full rounded-[2px] border border-admin-border bg-white focus-within:border-admin-text has-aria-invalid:border-admin-error",
        className,
      )}
    >
      <input
        type={shown ? "text" : "password"}
        className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[13px] text-ink outline-none"
        {...props}
      />
      <PasswordToggle variant="admin" shown={shown} onToggle={() => setShown((value) => !value)} />
    </div>
  );
}
