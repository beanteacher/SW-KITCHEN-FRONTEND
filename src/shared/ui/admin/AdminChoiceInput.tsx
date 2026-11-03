import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

export interface Props extends Omit<ComponentProps<"input">, "type"> {
  type: "checkbox" | "radio";
  label: string;
  // 표 안 체크박스처럼 상자만 보일 때. 이름은 화면 읽기 도구에만 들린다
  hideLabel?: boolean;
}

// 체크박스와 라디오는 브라우저 기본 입력을 쓰고 색만 맞춘다. 여러 개를 나란히 둘 때 오른쪽 16px 띄운다
// 잠기면(disabled) 이름을 흐리게 한다
export default function AdminChoiceInput({
  type,
  label,
  hideLabel,
  className,
  disabled,
  ...props
}: Props) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 text-[13px] leading-8 whitespace-nowrap",
        !hideLabel && "mr-4",
        disabled && "cursor-not-allowed text-faint",
        className,
      )}
    >
      <input type={type} className="size-[13px] accent-ink" disabled={disabled} {...props} />
      <span className={cn(hideLabel && "sr-only")}>{label}</span>
    </label>
  );
}
