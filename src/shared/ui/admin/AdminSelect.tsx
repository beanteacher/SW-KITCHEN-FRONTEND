"use client";

import { ChevronDown } from "lucide-react";
import { cn, useListbox } from "@/shared/lib";
import type { SelectOption } from "../Select";

interface Props<V extends string | number> {
  options: SelectOption<V>[];
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

// 관리자 화면 드롭다운 (높이 32, 모서리 2). 목록은 단추 바로 아래 붙어 열린다
export default function AdminSelect<V extends string | number>({
  options,
  value,
  onChange,
  placeholder = "선택",
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
        className="flex h-8 w-full items-center justify-between gap-2 rounded-[2px] border border-admin-border bg-white px-2.5 text-left text-[13px] text-admin-text focus:border-admin-text focus:outline-none disabled:cursor-not-allowed disabled:bg-admin-fill disabled:text-[#999] aria-invalid:border-admin-error aria-invalid:bg-[#fff8f8]"
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
        className="absolute top-full right-0 left-0 z-30 max-h-[300px] overflow-y-auto border border-t-0 border-admin-border bg-white"
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            {...optionProps(index)}
            className={cn(
              "cursor-pointer px-2.5 py-[7px] text-[13px] text-admin-text [&+&]:border-t [&+&]:border-[#f4f4f4]",
              index === activeIndex && "bg-[#f7f7f7]",
              option.value === value && "font-semibold",
              option.disabled && "cursor-not-allowed text-[#ccc]",
            )}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
