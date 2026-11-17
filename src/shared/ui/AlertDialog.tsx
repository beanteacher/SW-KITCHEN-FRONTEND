"use client";

import type { ReactNode } from "react";
import AdminButton from "./admin/AdminButton";
import Dialog from "./Dialog";

// 끝난 것(성공)은 창이 아니라 토스트로 알린다. 그래서 성공 모양은 두지 않는다
type AlertKind = "warning" | "notice" | "confirm";

const TITLE_CLASS: Record<AlertKind, string> = {
  warning: "text-danger",
  notice: "text-ink",
  confirm: "text-ink",
};

interface Props {
  open: boolean;
  kind: AlertKind;
  title: string;
  children?: ReactNode;
  onClose: () => void;
  // confirm 일 때 [삭제] 를 누르면 부른다
  onConfirm?: () => void;
  confirmLabel?: string;
  // [확인] 앞에 붙는 버튼 하나 (예: 막힘 창의 [제품 보기])
  extraAction?: { label: string; onClick: () => void };
}

// 알림 창. 막힘(경고)·안내는 [확인] 하나, 확인 요청은 [취소] [삭제]
export default function AlertDialog({
  open,
  kind,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "삭제",
  extraAction,
}: Props) {
  const actions =
    kind === "confirm" ? (
      <>
        <AdminButton variant="outline" size="sm" onClick={onClose}>
          취소
        </AdminButton>
        <AdminButton variant="danger" size="sm" autoFocus onClick={onConfirm}>
          {confirmLabel}
        </AdminButton>
      </>
    ) : (
      <>
        {extraAction && (
          <AdminButton variant="outline" size="sm" onClick={extraAction.onClick}>
            {extraAction.label}
          </AdminButton>
        )}
        <AdminButton size="sm" autoFocus onClick={onClose}>
          확인
        </AdminButton>
      </>
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      titleClassName={TITLE_CLASS[kind]}
      actions={actions}
    >
      {children}
    </Dialog>
  );
}
