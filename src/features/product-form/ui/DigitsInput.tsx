import type { ComponentProps } from "react";
import { cn, formatNumber } from "@/shared/lib";
import { AdminInput } from "@/shared/ui/admin";
import { PRODUCT_FIELD_CLASS } from "../config/fieldClass";

interface Props extends Omit<ComponentProps<typeof AdminInput>, "value" | "onChange"> {
  // 숫자만 든 글자
  value: string;
  onChange: (digits: string) => void;
  // 돈이면 천 단위 쉼표를 붙여 보여 준다
  money?: boolean;
}

// 숫자 칸: 숫자가 아닌 글자는 버리고 오른쪽 정렬. 폼 값은 쉼표 없는 숫자 글자다
export default function DigitsInput({ value, onChange, money, className, ...props }: Props) {
  return (
    <AdminInput
      {...props}
      inputMode="numeric"
      value={money && value ? formatNumber(Number(value)) : value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
      className={cn("text-right tabular-nums", PRODUCT_FIELD_CLASS, className)}
    />
  );
}
