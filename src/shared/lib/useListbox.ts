"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

interface ListboxItem<V> {
  value: V;
  disabled?: boolean;
}

// 고를 수 있는 다음 줄을 찾는다. 없으면 지금 줄을 그대로 둔다
function findEnabled<V>(items: ListboxItem<V>[], from: number, step: 1 | -1) {
  for (let i = from + step; i >= 0 && i < items.length; i += step) {
    if (!items[i].disabled) return i;
  }
  return from;
}

// 드롭다운의 열고 닫기·키보드(↑↓ Enter Space Esc Tab)·바깥 누르면 닫기. 모양은 부르는 쪽이 그린다
export function useListbox<V>(
  items: ListboxItem<V>[],
  value: V | null,
  onChange: (value: V) => void,
) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const openList = () => {
    const selectedIndex = items.findIndex((item) => item.value === value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : findEnabled(items, -1, 1));
    setOpen(true);
  };

  const choose = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    onChange(item.value);
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
      setActiveIndex(findEnabled(items, activeIndex, event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  };

  const optionId = (index: number) => `${listId}-${index}`;

  // 단추와 목록에 그대로 펼쳐 넣는 속성
  const triggerProps = {
    role: "combobox" as const,
    "aria-haspopup": "listbox" as const,
    "aria-expanded": open,
    "aria-controls": listId,
    "aria-activedescendant": open && activeIndex >= 0 ? optionId(activeIndex) : undefined,
    onClick: () => (open ? setOpen(false) : openList()),
    onKeyDown: handleKeyDown,
  };
  const optionProps = (index: number) => ({
    id: optionId(index),
    role: "option" as const,
    "aria-selected": items[index]?.value === value,
    "aria-disabled": items[index]?.disabled,
    // 누르는 순간 단추의 초점이 빠져 목록이 닫히지 않게 한다
    onPointerDown: (event: { preventDefault: () => void }) => event.preventDefault(),
    onClick: () => choose(index),
    onMouseEnter: () => !items[index]?.disabled && setActiveIndex(index),
  });

  return { open, activeIndex, rootRef, listId, triggerProps, optionProps };
}
