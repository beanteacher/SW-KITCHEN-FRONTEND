import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

export interface Props extends Omit<ComponentProps<"input">, "type"> {
  type: "checkbox" | "radio";
  label: string;
}

// 체크박스와 라디오는 브라우저 기본 입력을 쓰고 색만 맞춘다
export default function ChoiceInput({ type, label, className, ...props }: Props) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-1.5 text-[13px]", className)}>
      <input type={type} className="size-4 accent-ink" {...props} />
      {label}
    </label>
  );
}
