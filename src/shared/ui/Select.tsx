"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn, useListbox } from "@/shared/lib";

export interface SelectOption<V extends string | number> {
  value: V;
  label: string;
  // 줄 오른쪽에 붙는 글자 (예: 가격)
  extra?: ReactNode;
  disabled?: boolean;
}

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

// 사용자 화면 드롭다운 (높이 48, 둥글기 10). 관리자 화면은 admin/AdminSelect
export default function Select<V extends string | number>({
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
        className="flex h-12 w-full items-center justify-between gap-2 rounded-[10px] border border-line bg-white px-4 text-left text-[15px] focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 aria-invalid:border-danger"
        {...triggerProps}
        {...aria}
      >
        <span className={cn("truncate", !selected && "text-gray-400")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <ul
        id={listId}
        role="listbox"
        hidden={!open}
        className="absolute top-full right-0 left-0 z-30 mt-1 max-h-72 overflow-y-auto rounded-[10px] border border-line bg-white shadow-lg"
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            {...optionProps(index)}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-[15px]",
              index === activeIndex && "bg-gray-100",
              option.value === value && "font-bold",
              option.disabled && "cursor-not-allowed text-gray-300",
            )}
          >
            <span>{option.label}</span>
            {option.extra && <span className="shrink-0">{option.extra}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
