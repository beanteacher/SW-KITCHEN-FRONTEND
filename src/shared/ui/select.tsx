"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/shared/lib";

export interface SelectOption<V extends string | number> {
  value: V;
  label: string;
  // 줄 오른쪽에 붙는 글자 (예: 가격)
  extra?: ReactNode;
  disabled?: boolean;
}

// lg 는 쇼핑몰(높이 48, 둥글기 10), sm 은 관리자(높이 32, 둥글기 2)
const SIZE = {
  lg: {
    trigger: "h-12 rounded-[10px] px-4 text-[15px]",
    list: "rounded-[10px]",
    option: "px-4 py-3 text-[15px]",
  },
  sm: {
    trigger: "h-8 rounded-[2px] px-2.5 text-[13px]",
    list: "rounded-[2px]",
    option: "px-2.5 py-1.5 text-[13px]",
  },
};

interface SelectProps<V extends string | number> {
  options: SelectOption<V>[];
  value: V | null;
  onChange: (value: V) => void;
  placeholder?: string;
  size?: keyof typeof SIZE;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

// 고를 수 있는 다음 줄을 찾는다. 없으면 지금 줄을 그대로 둔다
function findEnabled<V extends string | number>(
  options: SelectOption<V>[],
  from: number,
  step: 1 | -1,
) {
  for (let i = from + step; i >= 0 && i < options.length; i += step) {
    if (!options[i].disabled) return i;
  }
  return from;
}

// 브라우저 기본 select 대신 어느 기기에서나 같은 모양으로 보이는 드롭다운
export function Select<V extends string | number>({
  options,
  value,
  onChange,
  placeholder = "선택",
  size = "sm",
  disabled,
  id,
  className,
  ...aria
}: SelectProps<V>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);
  const sizeClass = SIZE[size];

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const openList = () => {
    const selectedIndex = options.findIndex((option) => option.value === value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : findEnabled(options, -1, 1));
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(findEnabled(options, activeIndex, event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  };

  const optionId = (index: number) => `${listId}-${index}`;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 border border-line bg-white text-left focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 aria-invalid:border-danger",
          sizeClass.trigger,
        )}
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
        className={cn(
          "absolute top-full right-0 left-0 z-30 mt-1 max-h-72 overflow-y-auto border border-line bg-white shadow-lg",
          sizeClass.list,
        )}
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            id={optionId(index)}
            role="option"
            aria-selected={option.value === value}
            aria-disabled={option.disabled}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
            onMouseEnter={() => !option.disabled && setActiveIndex(index)}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-3",
              sizeClass.option,
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
