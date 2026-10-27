import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import PageTitle from "../PageTitle";

interface Props {
  title: string;
  // 제목 옆 작은 회색 글자 (예: 수정 화면의 #123)
  sub?: string;
  // 오른쪽 버튼 자리 (예: [+ 제품 등록], [목록으로])
  action?: ReactNode;
  // 바로 아래에 구역 제목이 오면 붙여 쓴다 (구역 제목이 위 여백을 갖는다)
  tight?: boolean;
}

// 관리 화면 맨 위: 제목 + 아래 회색 선 + 오른쪽 버튼
export default function AdminPageHeader({ title, sub, action, tight = false }: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-admin-line pb-3",
        tight ? "mb-1" : "mb-3",
      )}
    >
      <div className="flex items-baseline gap-2">
        <PageTitle title={title} variant="admin" />
        {sub && <small className="text-[13px] text-admin-muted">{sub}</small>}
      </div>
      {action}
    </div>
  );
}
