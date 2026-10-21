"use client";

import { useState } from "react";
import { toast } from "@/shared/lib";
import { AlertDialog, Button } from "@/shared/ui";

type Kind = "warning" | "success" | "confirm";

const SAMPLES: Record<Kind, { title: string; body: string }> = {
  warning: {
    title: "삭제 불가",
    body: '"테이블 냉장고"에 제품 9개가 연결되어 있어 삭제할 수 없습니다. 제품의 분류를 먼저 바꿔 주세요.',
  },
  success: { title: "저장 완료", body: "저장되었습니다." },
  confirm: { title: "분류 삭제", body: '"쇼케이스" 분류를 삭제할까요?' },
};

export function AlertPreview() {
  const [open, setOpen] = useState<Kind | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => setOpen("warning")}>
        막힘 (경고)
      </Button>
      <Button size="sm" variant="outline" onClick={() => setOpen("success")}>
        완료
      </Button>
      <Button size="sm" variant="outline" onClick={() => setOpen("confirm")}>
        묻기
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast("장바구니에 담았습니다.")}>
        짧은 알림 (성공)
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => toast("불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.", "error")}
      >
        짧은 알림 (오류)
      </Button>

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
