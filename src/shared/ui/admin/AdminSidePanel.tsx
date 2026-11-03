"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  // 무엇이 막고 있는지, 무엇을 하면 풀리는지 한 줄
  description?: ReactNode;
  children?: ReactNode;
}

// 관리자 옆 패널: 막힌 작업을 화면을 옮기지 않고 오른쪽에서 처리한다
// 알림 창(Dialog)처럼 브라우저 기본 <dialog> 에 포커스 가두기·Esc 닫기·닫은 뒤 원래 버튼으로 포커스 돌려주기를 맡긴다
export default function AdminSidePanel({ open, onClose, title, description, children }: Props) {
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
      // 바깥(어두운 곳)을 누르면 닫힌다. 패널 안을 누르면 target 이 안쪽 요소라 닫히지 않는다
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(1100px,92vw)] max-w-none bg-admin-bg p-0 text-[13px] text-ink shadow-[-6px_0_24px_rgba(0,0,0,.18)] backdrop:bg-black/40"
    >
      {open && (
        <div className="flex h-full flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-admin-line bg-white px-6 pt-[18px] pb-3.5">
            <div>
              <h2 id={titleId} className="text-[17px] font-bold">
                {title}
              </h2>
              {description && <p className="mt-1 leading-[18px] text-admin-sub">{description}</p>}
            </div>
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="grid size-8 shrink-0 place-items-center rounded-[2px] border border-admin-border bg-white text-[#444]"
            >
              <X className="size-4" aria-hidden />
            </button>
          </header>
          <div className="flex-1 overflow-auto px-6 pt-4 pb-8">{children}</div>
        </div>
      )}
    </dialog>
  );
}
