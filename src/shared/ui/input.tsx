import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

// 오류가 있으면 aria-invalid 를 주면 빨간 테두리가 된다
const FIELD_CLASS =
  "w-full rounded-[2px] border border-line bg-white px-2.5 text-[13px] text-ink placeholder:text-gray-400 focus:border-ink focus:outline-none disabled:bg-gray-100 aria-invalid:border-danger";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(FIELD_CLASS, "h-8", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(FIELD_CLASS, "min-h-24 py-2", className)} {...props} />;
}

// 체크박스와 라디오는 브라우저 기본 입력을 쓰고 색만 맞춘다
interface ChoiceProps extends Omit<ComponentProps<"input">, "type"> {
  label: string;
}

function Choice({
  type,
  label,
  className,
  ...props
}: ChoiceProps & { type: "checkbox" | "radio" }) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-1.5 text-[13px]", className)}>
      <input type={type} className="size-4 accent-ink" {...props} />
      {label}
    </label>
  );
}

export function Checkbox(props: ChoiceProps) {
  return <Choice type="checkbox" {...props} />;
}

export function Radio(props: ChoiceProps) {
  return <Choice type="radio" {...props} />;
}
