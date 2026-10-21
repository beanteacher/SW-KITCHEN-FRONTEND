"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/shared/lib";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleClassName?: string;
  children?: ReactNode;
  actions: ReactNode;
}

// 브라우저 기본 <dialog> 를 써서 포커스 가두기, Esc 닫기, 닫은 뒤 원래 버튼으로 포커스 돌려주기를 맡긴다
export function Dialog({ open, onClose, title, titleClassName, children, actions }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-[380px] rounded-[2px] p-6 text-[13px] text-ink backdrop:bg-black/50"
    >
      <h2 id={titleId} className={cn("mb-3 text-base font-bold", titleClassName)}>
        {title}
      </h2>
      {children && <div className="mb-5 leading-relaxed text-gray-600">{children}</div>}
      <div className="flex justify-end gap-2">{actions}</div>
    </dialog>
  );
}
