"use client";

import type { ReactNode } from "react";
import AdminButton from "./admin/AdminButton";
import Dialog from "./Dialog";

type AlertKind = "warning" | "success" | "notice" | "confirm";

const TITLE_CLASS: Record<AlertKind, string> = {
  warning: "text-danger",
  success: "text-success",
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
}

// 관리자 화면의 알림 창. 경고·성공·안내는 [확인] 하나, 확인 요청은 [취소] [삭제]
export default function AlertDialog({
  open,
  kind,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "삭제",
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
      <AdminButton size="sm" autoFocus onClick={onClose}>
        확인
      </AdminButton>
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
