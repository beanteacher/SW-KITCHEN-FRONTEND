"use client";

import { ChevronDown } from "lucide-react";
import { cn, useListbox } from "@/shared/lib";
import type { SelectOption } from "../Select";

// md 는 화면 칸(높이 32, 13px), sm 은 표 줄 안(높이 26, 12px)
const SIZE = {
  md: { trigger: "h-8 px-2.5 text-[13px]", option: "px-2.5 py-[7px] text-[13px]" },
  sm: { trigger: "h-[26px] px-2 text-xs", option: "px-2 py-[5px] text-xs" },
};

interface Props<V extends string | number> {
  options: SelectOption<V>[];
  size?: keyof typeof SIZE;
  value: V | null;
  onChange: (value: V) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

// 관리자 화면 드롭다운 (모서리 2). 목록은 단추 바로 아래 붙어 열리고, 열린 동안 테두리가 검정이다
export default function AdminSelect<V extends string | number>({
  options,
  value,
  onChange,
  placeholder = "선택",
  size = "md",
  disabled,
  id,
  className,
  ...aria
}: Props<V>) {
  const { open, activeIndex, rootRef, listId, triggerProps, optionProps } = useListbox(
    options,
    value,
    onChange,
  );
  const selected = options.find((option) => option.value === value);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[2px] border border-admin-border bg-white text-left text-admin-text focus:border-admin-text focus:outline-none disabled:cursor-not-allowed disabled:bg-admin-fill disabled:text-[#999] aria-invalid:border-admin-error aria-invalid:bg-[#fff8f8]",
          SIZE[size].trigger,
          open && "border-ink focus:border-ink",
        )}
        {...triggerProps}
        {...aria}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <ul
        id={listId}
        role="listbox"
        hidden={!open}
        className="absolute top-full right-0 left-0 z-30 max-h-[300px] overflow-y-auto border border-t-0 border-ink bg-white"
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            {...optionProps(index)}
            className={cn(
              "cursor-pointer text-admin-text [&+&]:border-t [&+&]:border-[#f4f4f4]",
              SIZE[size].option,
              index === activeIndex && !option.disabled && "bg-[#f7f7f7]",
              option.value === value && "font-semibold",
              option.disabled && "cursor-default text-faint",
            )}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
