"use client";

import { cn } from "@/shared/lib";

interface Option<V extends string> {
  value: V;
  label: string;
}

interface Props<V extends string> {
  options: Option<V>[];
  value: V;
  onChange: (value: V) => void;
  // 표 칸처럼 폭이 정해진 곳에서 칸 폭에 맞춰 늘린다
  fill?: boolean;
  disabled?: boolean;
  "aria-label": string;
}

// 2~3개 중 하나를 고르는 붙은 버튼 묶음 (높이 32). 항상 하나는 골라져 있다. 4개 이상이면 AdminSelect
export default function AdminSegment<V extends string>({
  options,
  value,
  onChange,
  fill = false,
  disabled,
  "aria-label": ariaLabel,
}: Props<V>) {
  return (
    <div role="group" aria-label={ariaLabel} className={fill ? "flex" : "inline-flex"}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          disabled={disabled}
          onClick={() => option.value !== value && onChange(option.value)}
          className={cn(
            "h-8 cursor-pointer border border-l-0 border-admin-border bg-white text-xs text-[#555] first:rounded-l-[2px] first:border-l last:rounded-r-[2px] disabled:cursor-default disabled:opacity-45 aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:font-semibold aria-pressed:text-white",
            fill ? "min-w-0 flex-1 p-0" : "min-w-20 px-3.5",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
