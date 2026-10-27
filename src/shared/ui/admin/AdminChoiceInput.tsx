import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

export interface Props extends Omit<ComponentProps<"input">, "type"> {
  type: "checkbox" | "radio";
  label: string;
}

// 체크박스와 라디오는 브라우저 기본 입력을 쓰고 색만 맞춘다. 여러 개를 나란히 둘 때 오른쪽 16px 띄운다
// 잠기면(disabled) 이름을 흐리게 한다
export default function AdminChoiceInput({ type, label, className, disabled, ...props }: Props) {
  return (
    <label
      className={cn(
        "mr-4 inline-flex cursor-pointer items-center gap-1 text-[13px] leading-8 whitespace-nowrap",
        disabled && "cursor-not-allowed text-faint",
        className,
      )}
    >
      <input type={type} className="size-[13px] accent-ink" disabled={disabled} {...props} />
      {label}
    </label>
  );
}
