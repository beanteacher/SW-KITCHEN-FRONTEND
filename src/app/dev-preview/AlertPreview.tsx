"use client";

import { useState } from "react";
import { toast } from "@/shared/lib";
import { AlertDialog } from "@/shared/ui";
import { AdminButton } from "@/shared/ui/admin";

type Kind = "warning" | "notice" | "confirm";

const SAMPLES: Record<Kind, { title: string; body: string }> = {
  warning: {
    title: "삭제 불가",
    body: '"테이블 냉장고"에 제품 9개가 연결되어 있어 삭제할 수 없습니다. 제품의 분류를 먼저 바꿔 주세요.',
  },
  notice: {
    title: "비밀번호 변경 권장",
    body: "처음 받은 비밀번호를 쓰고 있습니다. 비밀번호를 바꿔 주세요.",
  },
  confirm: {
    title: "분류를 삭제할까요?",
    body: '"쇼케이스" 분류를 삭제합니다. 되돌릴 수 없습니다.',
  },
};

export default function AlertPreview() {
  const [open, setOpen] = useState<Kind | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      <AdminButton size="sm" variant="outline" onClick={() => setOpen("warning")}>
        막힘 (경고)
      </AdminButton>
      <AdminButton size="sm" variant="outline" onClick={() => setOpen("notice")}>
        안내
      </AdminButton>
      <AdminButton size="sm" variant="outline" onClick={() => setOpen("confirm")}>
        묻기
      </AdminButton>
      <AdminButton size="sm" variant="outline" onClick={() => toast("장바구니에 담았습니다.")}>
        짧은 알림 (성공)
      </AdminButton>
      <AdminButton
        size="sm"
        variant="outline"
        onClick={() => toast("인터넷 연결이 끊겼습니다. 다시 시도해 주세요.", "error")}
      >
        짧은 알림 (연결 끊김)
      </AdminButton>

      {open && (
        <AlertDialog
          open
          kind={open}
          title={SAMPLES[open].title}
          onClose={() => setOpen(null)}
          onConfirm={() => setOpen(null)}
        >
          {SAMPLES[open].body}
        </AlertDialog>
      )}
    </div>
  );
}
